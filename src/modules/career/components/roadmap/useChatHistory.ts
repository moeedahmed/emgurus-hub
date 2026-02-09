import { useEffect, useState } from 'react';
import { supabase } from "@/modules/career/integrations/supabase/client";
import { Message } from './types';

export function useChatHistory(roadmapId?: string) {
    const [history, setHistory] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load history on mount or when roadmapId changes
    useEffect(() => {
        async function loadHistory() {
            if (!roadmapId) {
                setIsLoading(false);
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('ai_chat_messages')
                    .select('*')
                    .eq('roadmap_id', roadmapId)
                    .order('created_at', { ascending: true });

                if (error) {
                    console.error('Failed to load chat history:', error);
                    return;
                }

                if (data) {
                    const messages: Message[] = data.map(msg => ({
                        role: msg.role as 'user' | 'assistant',
                        content: msg.content,
                        contextLabel: msg.context_label || undefined
                    }));
                    setHistory(messages);
                }
            } catch (e) {
                console.error('Error loading history:', e);
            } finally {
                setIsLoading(false);
            }
        }

        loadHistory();
    }, [roadmapId]);

    // Save a new message with optional context label
    const saveMessage = async (role: 'user' | 'assistant', content: string, contextLabel?: string) => {
        if (!roadmapId) return;

        try {
            const { error } = await supabase
                .from('ai_chat_messages')
                .insert({
                    roadmap_id: roadmapId,
                    role,
                    content,
                    context_label: contextLabel || null
                });

            if (error) {
                console.error('Failed to save message:', error);
            }
        } catch (e) {
            console.error('Error saving message:', e);
        }
    };

    return { history, isLoading, saveMessage };
}
