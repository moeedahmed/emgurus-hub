import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GraduationCap, BookOpen, Newspaper, Zap, Shield, Sparkles } from 'lucide-react';

const features = [
  {
    icon: GraduationCap,
    title: 'Career Guru',
    description: 'AI-powered career pathways, goals, and roadmaps tailored to your stage and specialty.',
  },
  {
    icon: BookOpen,
    title: 'Exam Guru',
    description: 'Personalised exam prep with diagnostics, weak topic targeting, and spaced repetition.',
  },
  {
    icon: Newspaper,
    title: 'Blog',
    description: 'Expert insights, career tips, and guidance for doctors at every stage.',
  },
];

const highlights = [
  { icon: Zap, text: 'Structured workflows, not generic chatbots' },
  { icon: Shield, text: 'Reliable, referenced outputs you can trust' },
  { icon: Sparkles, text: 'Practical documents you can export and use' },
];

export function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto flex h-14 items-center justify-between px-4">
          <span className="text-lg font-bold text-primary">EMGurus</span>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 sm:py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            Your AI-powered toolkit for{' '}
            <span className="text-primary">medical career success</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            One platform for exams, career progression, portfolio building, and more. 
            Structured workflows that produce practical, exportable outputs — not generic chat.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Start Free
              </Button>
            </Link>
            <Link to="/blog">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Read the Blog
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-12 px-4 border-t border-border">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-6">
          {highlights.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3 text-sm text-muted-foreground">
              <Icon className="h-5 w-5 text-primary shrink-0" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Modules */}
      <section className="py-16 px-4 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">Your modules</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, description }) => (
              <div key={title} className="rounded-xl border border-border bg-card p-6">
                <Icon className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 border-t border-border">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to level up your career?</h2>
          <p className="text-muted-foreground mb-6">
            Join doctors who are using AI to work smarter, not harder.
          </p>
          <Link to="/signup">
            <Button size="lg">Get Started — It's Free</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <span>© 2026 Solvoro Labs. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
