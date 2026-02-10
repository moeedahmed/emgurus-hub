import { Routes, Route } from 'react-router-dom';
import { Newspaper, PenSquare } from 'lucide-react';
import { ModuleLayout } from '@/core/layouts/ModuleLayout';
import Blogs from './pages/Blogs';
import BlogDetail from './pages/BlogDetail';
import BlogCategory from './pages/BlogCategory';
import BlogsEditor from './pages/BlogsEditor';
import EditorNew from './pages/EditorNew';
import EditorEdit from './pages/EditorEdit';

const blogNav = [
  { to: '/blog', icon: Newspaper, label: 'All Posts' },
  { to: '/blog/editor/new', icon: PenSquare, label: 'Write' },
];

export function BlogRoutes() {
  return (
    <ModuleLayout title="Blog" navItems={blogNav}>
      <Routes>
        <Route index element={<Blogs />} />
        <Route path=":slug" element={<BlogDetail />} />
        <Route path="category/:category" element={<BlogCategory />} />
        <Route path="editor" element={<BlogsEditor />} />
        <Route path="editor/new" element={<EditorNew />} />
        <Route path="editor/:id" element={<EditorEdit />} />
      </Routes>
    </ModuleLayout>
  );
}
