import { Link } from 'react-router-dom';
import { useAuth } from '@/core/auth/AuthProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, BookOpen, Newspaper, MessageSquare, FlaskConical, FileText, Briefcase, Mic, ClipboardList } from 'lucide-react';

const modules = [
  {
    id: 'career',
    name: 'Career Guru',
    description: 'AI-powered career pathways and roadmaps',
    icon: GraduationCap,
    to: '/career',
    status: 'active' as const,
  },
  {
    id: 'exam',
    name: 'Exam Guru',
    description: 'Personalised exam prep and spaced repetition',
    icon: BookOpen,
    to: '/exam',
    status: 'active' as const,
  },
  {
    id: 'blog',
    name: 'Blog',
    description: 'Expert insights and career guidance',
    icon: Newspaper,
    to: '/blog',
    status: 'active' as const,
  },
  {
    id: 'forum',
    name: 'Forum',
    description: 'Discuss cases, share tips, connect with peers',
    icon: MessageSquare,
    to: '/forum',
    status: 'active' as const,
  },
  {
    id: 'qip',
    name: 'QIP Guru',
    description: 'Quality improvement project workflows',
    icon: FlaskConical,
    to: '#',
    status: 'coming_soon' as const,
  },
  {
    id: 'portfolio',
    name: 'Portfolio Guru',
    description: 'CPD tracking and portfolio building',
    icon: FileText,
    to: '#',
    status: 'coming_soon' as const,
  },
  {
    id: 'job',
    name: 'Job Search Guru',
    description: 'CV optimisation and job applications',
    icon: Briefcase,
    to: '#',
    status: 'coming_soon' as const,
  },
  {
    id: 'interview',
    name: 'Interview Guru',
    description: 'Interview prep and practice',
    icon: Mic,
    to: '#',
    status: 'coming_soon' as const,
  },
  {
    id: 'research',
    name: 'Research Guru',
    description: 'Research productivity and publications',
    icon: ClipboardList,
    to: '#',
    status: 'coming_soon' as const,
  },
];

export function HubDashboard() {
  const { profile } = useAuth();
  const firstName = profile?.display_name || 'Doctor';

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {firstName}</h1>
        <p className="text-muted-foreground mt-1">What would you like to work on today?</p>
      </div>

      {/* Module grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {modules.map(({ id, name, description, icon: Icon, to, status }) => {
          const isActive = status === 'active';
          const Wrapper = isActive ? Link : 'div';

          return (
            <Wrapper
              key={id}
              to={isActive ? to : '#'}
              className={`block ${!isActive ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Card className={`h-full transition-colors ${isActive ? 'hover:border-primary/40' : ''}`}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Icon className={`h-6 w-6 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                    {!isActive && (
                      <Badge variant="secondary" className="text-xs">Soon</Badge>
                    )}
                  </div>
                  <CardTitle className="text-sm font-semibold mt-2">{name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-xs">{description}</CardDescription>
                </CardContent>
              </Card>
            </Wrapper>
          );
        })}
      </div>
    </div>
  );
}
