import { Routes, Route } from 'react-router-dom';
import { MessageSquare, PenSquare } from 'lucide-react';
import { ModuleLayout } from '@/core/layouts/ModuleLayout';
import ThreadList from './pages/ThreadList';
import ThreadDetail from './pages/ThreadDetail';
import NewThread from './pages/NewThread';

const forumNav = [
  { to: '/forum', icon: MessageSquare, label: 'All Threads' },
  { to: '/forum/new', icon: PenSquare, label: 'New Thread' },
];

export function ForumRoutes() {
  return (
    <ModuleLayout title="Forum" navItems={forumNav}>
      <Routes>
        <Route index element={<ThreadList />} />
        <Route path="thread/:threadId" element={<ThreadDetail />} />
        <Route path="new" element={<NewThread />} />
      </Routes>
    </ModuleLayout>
  );
}
