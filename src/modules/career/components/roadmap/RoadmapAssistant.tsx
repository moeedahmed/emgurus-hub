import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Send, Loader2, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useIsMobile } from '@/modules/career/hooks/use-mobile';
import { useAuth } from '@/modules/career/contexts/AuthContext';
import { RoadmapNode, Roadmap } from '@/modules/career/hooks/useRoadmap';
import { useChatHistory } from './useChatHistory';
import { Message } from './types';
import { cn } from '@/lib/utils';
import { logger } from '@/modules/career/lib/logger';
import { supabase } from '@/modules/career/integrations/supabase/client';
import { usePathwayProgress } from '@/modules/career/hooks/usePathwayProgress';
import { useUserMilestones } from '@/modules/career/hooks/useUserMilestones';
import { useProfile } from '@/modules/career/hooks/useProfile';

export type { Message };

interface UserProfile {
  displayName?: string;
  specialty?: string;
  currentCountry?: string;
  careerStage?: string;
  preferredCountries?: string[];
}

interface RoadmapAssistantProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal: {
    title: string;
    type: string;
    narrative?: string | null;
    target_role?: string | null;
    target_country?: string | null;
    timeline?: string | null;
  } | null;
  roadmap: Roadmap | null;
  userProfile?: UserProfile;
  initialSelectedStep?: RoadmapNode | null;
}

type ContextSelection = 'roadmap' | string; // 'roadmap' or node id

const AI_ASSISTANT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-assistant`;

async function streamChat({
  messages,
  goalContext,
  stepContext,
  userProfile,
  milestonesContext,
  token,
  onDelta,
  onDone,
  onError,
}: {
  messages: Message[];
  goalContext: Record<string, unknown>;
  stepContext?: Record<string, unknown>;
  userProfile?: UserProfile;
  milestonesContext?: Record<string, unknown>;
  token: string;
  onDelta: (deltaText: string) => void;
  onDone: () => void;
  onError: (error: string) => void;
}) {
  try {
    if (!token) {
      onError('No authentication token available. Please try signing out and back in.');
      return;
    }

    const resp = await fetch(AI_ASSISTANT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        'x-user-token': token,
      },
      body: JSON.stringify({
        messages,
        goalContext,
        stepContext: stepContext || null,
        userProfile,
        milestonesContext
      }),
    });

    if (!resp.ok) {
      const rawText = await resp.text();

      let errorData: Record<string, string> = {};
      try {
        errorData = JSON.parse(rawText);
      } catch {
        // Response is not JSON
      }

      if (resp.status === 429) {
        onError('Rate limit exceeded. Please wait a moment and try again.');
        return;
      }
      if (resp.status === 402) {
        onError('AI credits exhausted. Please add credits to continue.');
        return;
      }
      if (resp.status === 403) {
        onError('AI message quota exceeded. Upgrade to continue chatting.');
        return;
      }
      onError(errorData.error || `Failed to get response (Status: ${resp.status})`);
      return;
    }

    if (!resp.body) {
      onError('No response body');
      return;
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = '';
    let streamDone = false;

    while (!streamDone) {
      const { done, value } = await reader.read();
      if (done) break;
      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);

        if (line.endsWith('\r')) line = line.slice(0, -1);
        if (line.startsWith(':') || line.trim() === '') continue;
        if (!line.startsWith('data: ')) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === '[DONE]') {
          streamDone = true;
          break;
        }

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) onDelta(content);
        } catch {
          textBuffer = line + '\n' + textBuffer;
          break;
        }
      }
    }

    // Flush any remaining bytes from the decoder
    textBuffer += decoder.decode();

    // Final flush
    if (textBuffer.trim()) {
      for (let raw of textBuffer.split('\n')) {
        if (!raw) continue;
        if (raw.endsWith('\r')) raw = raw.slice(0, -1);
        if (raw.startsWith(':') || raw.trim() === '') continue;
        if (!raw.startsWith('data: ')) continue;
        const jsonStr = raw.slice(6).trim();
        if (jsonStr === '[DONE]') continue;
        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) onDelta(content);
        } catch {
          /* ignore */
        }
      }
    }

    onDone();
  } catch (error) {
    logger.error('Stream error:', error);
    onError('Connection error. Please try again.');
  }
}

export const RoadmapAssistant = ({
  open,
  onOpenChange,
  goal,
  roadmap,
  userProfile,
  initialSelectedStep,
}: RoadmapAssistantProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedContext, setSelectedContext] = useState<ContextSelection>('roadmap');
  // Cache suggestions per context to avoid re-fetching on context switch
  const [suggestionsCache, setSuggestionsCache] = useState<Record<string, string[]>>({});
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  // Ref mirror of cache — lets fetchSuggestions read latest cache without being a useCallback dep
  const suggestionsCacheRef = useRef(suggestionsCache);
  suggestionsCacheRef.current = suggestionsCache;

  // Derive current suggestions from cache
  const currentSuggestions = suggestionsCache[selectedContext] || [];
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { user, session } = useAuth();

  // Get avatar URL from Google OAuth user metadata or identities fallback
  const userAvatarUrl =
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture ||
    user?.identities?.find((i) => i.identity_data?.avatar_url || i.identity_data?.picture)?.identity_data
      ?.avatar_url ||
    user?.identities?.find((i) => i.identity_data?.picture)?.identity_data?.picture ||
    null;

  // Relational milestone progress for AI context
  const { data: profile } = useProfile();
  const { data: userMilestones } = useUserMilestones();
  const pathwayResults = usePathwayProgress(
    profile ? {
      pathway_ids: profile.pathway_ids,
      specialty: profile.specialty,
      custom_milestones: profile.custom_milestones,
    } : null,
    userMilestones,
  );

  // Chat History Hook
  const { history, isLoading: isLoadingHistory, saveMessage } = useChatHistory(roadmap?.id);

  // Load history into messages when available
  useEffect(() => {
    if (history.length > 0) {
      setMessages(history);
    }
  }, [history]);

  const nodes = roadmap?.nodes || [];

  // Set initial context based on initialSelectedStep
  useEffect(() => {
    if (open) {
      if (initialSelectedStep) {
        setSelectedContext(initialSelectedStep.id);
      } else {
        setSelectedContext('roadmap');
      }
      // Note: Do NOT clear messages here - let useChatHistory handle history loading
      setInput('');
    }
  }, [open, initialSelectedStep]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input when dialog opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // Handle textarea auto-resize
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  // Change context without clearing messages - history is shared across contexts
  const handleContextChange = (context: ContextSelection) => {
    setSelectedContext(context);
    // Note: Do NOT clear messages - chat history persists across context switches
  };

  const getSelectedNode = (): RoadmapNode | null => {
    if (selectedContext === 'roadmap') return null;
    return nodes.find(n => n.id === selectedContext) || null;
  };

  const fetchSuggestions = useCallback(async (contextId: ContextSelection) => {
    // Guard: Require goal to be defined before fetching
    if (!goal) return;

    // Skip if already cached (read from ref to avoid stale closure)
    if (suggestionsCacheRef.current[contextId]?.length > 0) return;

    // Get the node for this specific contextId (not selectedContext which may be stale)
    const contextNode = contextId === 'roadmap' ? null : nodes.find(n => n.id === contextId) || null;
    if (!contextNode && contextId !== 'roadmap') return;

    setIsLoadingSuggestions(true);

    try {
      const { data: { session: freshSession } } = await supabase.auth.getSession();

      if (!freshSession?.access_token) return;

      const payload = {
        mode: 'suggestions',
        goalContext: {
          title: goal.title,
          type: goal.type,
          targetCountry: goal.target_country,
          targetRole: goal.target_role,
          timeline: goal.timeline,
          narrative: goal.narrative,
          nodes: nodes
        },
        stepContext: contextNode ? {
          title: contextNode.title,
          timeframe: contextNode.timeframe,
          status: contextNode.status,
          why: contextNode.why,
          how: contextNode.how
        } : undefined,
        userProfile: userProfile,
        documentsContext: []
      };

      const response = await fetch(AI_ASSISTANT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${freshSession.access_token}`,
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          'x-user-token': freshSession.access_token,
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();

        if (data.suggestions && Array.isArray(data.suggestions) && data.suggestions.length > 0) {
          // Update cache for this specific context
          setSuggestionsCache(prev => ({ ...prev, [contextId]: data.suggestions }));
        }
      } else {
        logger.error('[Suggestions] API Error:', response.status, await response.text());
      }
    } catch (error) {
      logger.error('[Suggestions] Fetch error:', error);
    } finally {
      setIsLoadingSuggestions(false);
    }
  }, [goal, nodes, userProfile]);

  // Fetch suggestions when dialog opens or context changes (cache check happens inside)
  useEffect(() => {
    if (open && goal) {
      fetchSuggestions(selectedContext);
    }
  }, [open, goal, selectedContext, fetchSuggestions]);

  const handleSend = async () => {
    if (!input.trim() || !goal || isLoading) return;

    const selectedNode = getSelectedNode();

    // Compute context label for this message
    const contextLabel = selectedNode
      ? `Step ${nodes.findIndex(n => n.id === selectedNode.id) + 1}`
      : 'Roadmap';

    // Build goal context (always needed)
    const goalData = {
      title: goal.title,
      type: goal.type,
      narrative: goal.narrative || undefined,
      targetRole: goal.target_role || undefined,
      targetCountry: goal.target_country || undefined,
      timeline: goal.timeline || undefined,
      nodes: nodes.map(node => ({
        title: node.title,
        timeframe: node.timeframe,
        status: node.status,
        why: node.why,
        how: node.how,
      })),
    };

    // Build step context (only if a specific step is selected)
    const stepData = selectedNode ? {
      id: selectedNode.id,
      title: selectedNode.title,
      timeframe: selectedNode.timeframe || '30d',
      status: selectedNode.status,
      dependencies: selectedNode.dependencies,
      why: selectedNode.why || '',
      how: selectedNode.how,
      examples: selectedNode.examples,
      sources: selectedNode.sources,
      confidence: selectedNode.confidence,
      position: selectedNode.position,
    } : undefined;

    const userMessage: Message = { role: 'user', content: input.trim(), contextLabel };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Save user message to DB with context label
    saveMessage('user', input.trim(), contextLabel);

    // Track full content for saving to DB
    let fullResponseAccumulator = '';

    const updateAssistant = (chunk: string) => {
      fullResponseAccumulator += chunk;

      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === 'assistant') {
          return prev.map((m, i) =>
            i === prev.length - 1
              ? { ...m, content: (m.content || '') + chunk, contextLabel }
              : m
          );
        }
        return [...prev, { role: 'assistant', content: chunk, contextLabel }];
      });
    };

    try {
      // Get fresh session token to avoid "Invalid token" errors from stale state
      const { data: { session: freshSession }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !freshSession?.access_token) {
        throw new Error('Authentication expired. Please sign in again.');
      }

      // Build milestone progress context from relational data
      let milestonesContext = undefined;
      if (pathwayResults && pathwayResults.length > 0) {
        // Find the result matching the goal's target_role, or fall back to first pathway
        const matchedResult = pathwayResults.find(r =>
          r.pathway?.targetRole === goal.target_role
        ) || pathwayResults[0];

        milestonesContext = {
          completed: matchedResult.completed.map(m => m.name),
          nextSteps: matchedResult.nextSteps.map(m => m.name),
          percentComplete: matchedResult.percentComplete,
          totalRequired: matchedResult.totalRequired,
          pathwayName: matchedResult.pathway?.name,
        };
      }

      await streamChat({
        messages: [...messages, userMessage],
        goalContext: goalData,
        stepContext: stepData,
        userProfile,
        milestonesContext,
        token: freshSession.access_token,
        onDelta: updateAssistant,
        onDone: () => {
          setIsLoading(false);
          // Save full AI response to DB with context label
          saveMessage('assistant', fullResponseAccumulator, contextLabel);
        },
        onError: (error) => {
          setIsLoading(false);
          toast({
            title: 'Error',
            description: error,
            variant: 'destructive',
          });
        },
      });
    } catch (err: unknown) {
      setIsLoading(false);
      toast({
        title: 'Connection Error',
        description: err instanceof Error ? err.message : 'Failed to connect to AI service',
        variant: 'destructive',
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const selectedNode = getSelectedNode();

  // FIXED: Content is now inlined (not a separate component) to prevent re-renders that broke typing
  const content = (
    <>
      {/* Context Chips */}
      <div className="px-4 py-3 border-b border-border shrink-0">
        <p className="text-xs text-muted-foreground mb-2">Select context:</p>
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={selectedContext === 'roadmap' ? 'default' : 'outline'}
            className={cn(
              'cursor-pointer transition-colors',
              selectedContext === 'roadmap'
                ? ''
                : 'hover:bg-accent hover:text-accent-foreground'
            )}
            onClick={() => handleContextChange('roadmap')}
          >
            Entire Roadmap
          </Badge>
          {nodes.map((node, index) => (
            <Badge
              key={node.id}
              variant={selectedContext === node.id ? 'default' : 'outline'}
              className={cn(
                'cursor-pointer transition-colors max-w-[150px] truncate',
                selectedContext === node.id
                  ? ''
                  : 'hover:bg-accent hover:text-accent-foreground'
              )}
              onClick={() => handleContextChange(node.id)}
              title={node.title}
            >
              Step {index + 1}
            </Badge>
          ))}
        </div>
      </div>

      <ScrollArea className="flex-1" ref={scrollRef}>
        <div className="space-y-4 p-4">
          {/* Welcome message */}
          {messages.length === 0 && (
            <motion.div
              key={selectedContext}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="bg-muted rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  {selectedNode ? (
                    <>
                      Hi! I'm here to help you with <span className="font-medium text-foreground">{selectedNode.title}</span>.
                      Ask me anything about this step — requirements, timelines, tips, or any questions you have.
                    </>
                  ) : (
                    <>
                      Hi! I'm here to help you with your roadmap for <span className="font-medium text-foreground">{goal?.title}</span>.
                      Ask me about prioritization, timeline adjustments, risks, or any strategic questions.
                    </>
                  )}
                </p>
              </div>

              {/* Suggested questions - only show when available */}
              {(isLoadingSuggestions || currentSuggestions.length > 0) && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground font-medium flex items-center gap-2">
                    Suggested questions:
                    {isLoadingSuggestions && <Loader2 className="w-3 h-3 animate-spin text-muted-foreground/50" />}
                  </p>

                  {isLoadingSuggestions && currentSuggestions.length === 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-7 w-32 bg-muted animate-pulse rounded-md" />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {currentSuggestions.map((q) => (
                        <Button
                          key={q}
                          variant="outline"
                          size="sm"
                          className="text-xs h-auto min-h-7 text-left whitespace-normal py-1 px-3"
                          onClick={() => {
                            setInput(q);
                            inputRef.current?.focus();
                          }}
                        >
                          {q}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* Messages */}
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                )}
                <div className="flex flex-col gap-1 max-w-[80%]">
                  {/* Context Badge */}
                  {msg.contextLabel && (
                    <span className={cn(
                      "text-[10px] px-1.5 py-0.5 rounded w-fit",
                      msg.role === 'user'
                        ? "bg-primary/20 text-primary-foreground/80 self-end"
                        : "bg-muted-foreground/20 text-muted-foreground"
                    )}>
                      {msg.contextLabel}
                    </span>
                  )}
                  <div
                    className={`rounded-lg px-3 py-2 text-sm ${msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                      }`}
                  >
                    {msg.role === 'assistant' ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-2 prose-ul:my-2 prose-li:my-1 prose-headings:mt-3 prose-headings:mb-2 text-foreground">
                        <ReactMarkdown
                          components={{
                            a: ({ node, ...props }) => (
                              <a target="_blank" rel="noopener noreferrer" className="text-primary hover:underline" {...props} />
                            ),
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    )}
                  </div>
                </div>
                {msg.role === 'user' && (
                  <Avatar className="w-7 h-7 shrink-0">
                    {userAvatarUrl ? (
                      <AvatarImage
                        src={userAvatarUrl}
                        alt={userProfile?.displayName || 'User'}
                      />
                    ) : null}
                    <AvatarFallback className="bg-primary/10 text-primary text-[10px]">
                      {(userProfile?.displayName?.[0] || user?.email?.[0] || 'U').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading indicator */}
          {isLoading && messages[messages.length - 1]?.role === 'user' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div className="bg-muted rounded-lg px-3 py-2">
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border shrink-0">
        <div className="flex gap-2 items-end">
          <Textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={selectedNode ? `Ask about ${selectedNode.title}...` : 'Ask about your roadmap...'}
            disabled={isLoading}
            className="flex-1 min-h-[40px] max-h-[150px] resize-none py-2.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            rows={1}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="mb-0.5"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </>
  );

  // Mobile: Use Drawer (swipe to close)
  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="h-[85dvh] flex flex-col p-0">
          <DrawerHeader className="px-4 py-3 border-b border-border shrink-0">
            <DrawerTitle className="flex items-center gap-2 text-base">
              <Bot className="w-5 h-5 text-primary" />
              AI Assistant
            </DrawerTitle>
          </DrawerHeader>
          {content}
        </DrawerContent>
      </Drawer>
    );
  }

  // Desktop: Use Dialog
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg h-[85vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-4 py-3 border-b border-border shrink-0">
          <DialogTitle className="flex items-center gap-2 text-base">
            <Bot className="w-5 h-5 text-primary" />
            AI Assistant
          </DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
};
