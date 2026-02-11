import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/core/auth/supabase';
import { useAuth } from '@/core/auth/AuthProvider';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

interface Category { id: string; title: string }

export default function NewThread() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from('forum_categories').select('id, title').order('title')
      .then(({ data }) => setCategories(data || []));
  }, []);

  const canSubmit = categoryId && title.trim().length >= 5 && content.trim().length >= 10;

  async function handleSubmit() {
    if (!user || !canSubmit) return;
    setSaving(true);
    try {
      const { data, error } = await supabase.from('forum_threads').insert({
        category_id: categoryId,
        author_id: user.id,
        title: title.trim(),
        content: content.trim(),
      }).select('id').single();

      if (error) throw error;
      toast.success('Thread created');
      navigate(`/forum/thread/${data.id}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to create thread');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg font-[var(--font-display)]">Start a New Thread</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
              <SelectContent>
                {categories.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="thread-title">Title</Label>
            <Input
              id="thread-title"
              placeholder="Thread title (min 5 characters)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="thread-content">Content</Label>
            <Textarea
              id="thread-content"
              placeholder="Write your post (min 10 characters)..."
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate('/forum')}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={!canSubmit || saving}>
              {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Creating...</> : 'Create Thread'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
