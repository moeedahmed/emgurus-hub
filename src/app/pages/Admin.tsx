import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/core/auth/supabase';
import { useAdmin } from '@/core/hooks/useAdmin';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Users, FileText, Activity, Shield, Newspaper, BookOpen, MessageSquare,
  Pin, Lock, Loader2,
} from 'lucide-react';

interface UserRow {
  id: string;
  display_name: string | null;
  email: string | null;
  track: string | null;
  career_stage: string | null;
  avatar_url: string | null;
  created_at: string | null;
  roles: string[];
}

export function Admin() {
  const { isAdmin, isLoading: roleLoading } = useAdmin();

  if (roleLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <Shield className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
        <p className="text-muted-foreground">You need admin privileges to access this page.</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-[var(--font-display)]">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Manage users, content, and system health.</p>
      </div>

      <Tabs defaultValue="users">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="users" className="gap-1.5">
            <Users className="h-4 w-4" /> Users
          </TabsTrigger>
          <TabsTrigger value="content" className="gap-1.5">
            <FileText className="h-4 w-4" /> Content
          </TabsTrigger>
          <TabsTrigger value="system" className="gap-1.5">
            <Activity className="h-4 w-4" /> System
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-4">
          <UsersTab />
        </TabsContent>
        <TabsContent value="content" className="mt-4">
          <ContentTab />
        </TabsContent>
        <TabsContent value="system" className="mt-4">
          <SystemTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ============================================================
   Users Tab
   ============================================================ */
function UsersTab() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => { loadUsers(); }, []);

  async function loadUsers() {
    setLoading(true);
    try {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, display_name, email, track, career_stage, avatar_url, created_at')
        .order('created_at', { ascending: false });

      const userIds = (profiles || []).map(p => p.id);
      const { data: rolesData } = userIds.length > 0
        ? await supabase.from('user_roles').select('user_id, role').in('user_id', userIds)
        : { data: [] };

      const roleMap: Record<string, string[]> = {};
      (rolesData || []).forEach(r => {
        if (!roleMap[r.user_id]) roleMap[r.user_id] = [];
        roleMap[r.user_id].push(r.role);
      });

      const enriched: UserRow[] = (profiles || []).map(p => ({
        ...p,
        roles: roleMap[p.id] || [],
      }));

      setUsers(enriched);
    } catch (err: any) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }

  async function changeRole(userId: string, newRole: string) {
    try {
      // Remove existing roles, add new one
      await supabase.from('user_roles').delete().eq('user_id', userId);
      if (newRole !== 'user') {
        await supabase.from('user_roles').insert({ user_id: userId, role: newRole });
      }
      toast.success('Role updated');
      await loadUsers();
    } catch (err: any) {
      toast.error('Failed to update role');
    }
  }

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    const matchesSearch = !q || (u.display_name || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q);
    const matchesRole = !roleFilter ||
      (roleFilter === 'user' && u.roles.length === 0) ||
      u.roles.includes(roleFilter);
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1"
        />
        <Select value={roleFilter || '__all__'} onValueChange={v => setRoleFilter(v === '__all__' ? '' : v)}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="All roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">All Roles</SelectItem>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="guru">Guru</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead className="hidden sm:table-cell">Track</TableHead>
                <TableHead className="hidden md:table-cell">Joined</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="w-32">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map(u => (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarImage src={u.avatar_url || undefined} />
                          <AvatarFallback className="text-xs">
                            {(u.display_name || 'U').slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{u.display_name || 'Unnamed'}</p>
                          <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <span className="text-sm capitalize">{u.track || '—'}</span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="text-sm">{u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={u.roles.includes('admin') ? 'default' : u.roles.includes('guru') ? 'secondary' : 'outline'} className="text-xs">
                        {u.roles.includes('admin') ? 'Admin' : u.roles.includes('guru') ? 'Guru' : 'User'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={u.roles.includes('admin') ? 'admin' : u.roles.includes('guru') ? 'guru' : 'user'}
                        onValueChange={v => changeRole(u.id, v)}
                      >
                        <SelectTrigger className="h-8 text-xs w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="guru">Guru</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <p className="text-xs text-muted-foreground">{filtered.length} users total</p>
    </div>
  );
}

/* ============================================================
   Content Tab
   ============================================================ */
function ContentTab() {
  const [stats, setStats] = useState({ blogs: 0, questions: 0, threads: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [blogRes, qRes, threadRes] = await Promise.all([
          supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
          supabase.from('exam_questions').select('id', { count: 'exact', head: true }),
          supabase.from('forum_threads').select('id', { count: 'exact', head: true }),
        ]);
        setStats({
          blogs: blogRes.count || 0,
          questions: qRes.count || 0,
          threads: threadRes.count || 0,
        });
      } catch {} finally { setLoading(false); }
    }
    loadStats();
  }, []);

  const contentLinks = [
    {
      title: 'Blog Posts',
      description: 'Manage articles, assign reviewers, publish posts',
      icon: Newspaper,
      count: stats.blogs,
      to: '/blog',
    },
    {
      title: 'Exam Questions',
      description: 'Review questions, assign to gurus, approve/reject',
      icon: BookOpen,
      count: stats.questions,
      to: '/exam',
    },
    {
      title: 'Forum Threads',
      description: 'Pin threads, lock discussions, moderate content',
      icon: MessageSquare,
      count: stats.threads,
      to: '/forum',
    },
  ];

  return (
    <div className="space-y-4">
      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          {contentLinks.map(item => (
            <Link key={item.title} to={item.to}>
              <Card className="h-full transition hover:border-primary/30 hover:shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <item.icon className="h-5 w-5 text-primary" />
                    <span className="text-2xl font-bold">{item.count}</span>
                  </div>
                  <CardTitle className="text-sm font-semibold mt-2">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/blog/editor/new"><Newspaper className="h-4 w-4 mr-1.5" /> New Blog Post</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/forum/new"><MessageSquare className="h-4 w-4 mr-1.5" /> New Forum Thread</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ============================================================
   System Tab
   ============================================================ */
function SystemTab() {
  const [stats, setStats] = useState({ users: 0, usage: 0, modules: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [usersRes, usageRes, flagsRes] = await Promise.all([
          supabase.from('profiles').select('id', { count: 'exact', head: true }),
          supabase.from('hub_usage').select('id', { count: 'exact', head: true }),
          supabase.from('feature_flags').select('id', { count: 'exact', head: true }).eq('enabled', true),
        ]);
        setStats({
          users: usersRes.count || 0,
          usage: usageRes.count || 0,
          modules: flagsRes.count || 0,
        });
      } catch {} finally { setLoading(false); }
    }
    load();
  }, []);

  if (loading) {
    return <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  const metrics = [
    { label: 'Total Users', value: stats.users, icon: Users },
    { label: 'API Actions', value: stats.usage, icon: Activity },
    { label: 'Active Modules', value: stats.modules, icon: Shield },
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        {metrics.map(m => (
          <Card key={m.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <m.icon className="h-5 w-5 text-muted-foreground" />
                <span className="text-2xl font-bold">{m.value}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">{m.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">System Health</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Advanced analytics and monitoring coming soon. This dashboard will show API usage trends,
            active user metrics, error rates, and module performance.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
