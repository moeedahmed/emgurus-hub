import { Routes, Route } from 'react-router-dom';
import Blogs from './pages/Blogs';
import BlogDetail from './pages/BlogDetail';
import BlogCategory from './pages/BlogCategory';
import BlogsEditor from './pages/BlogsEditor';
import EditorNew from './pages/EditorNew';
import EditorEdit from './pages/EditorEdit';

export function BlogRoutes() {
  return (
    <Routes>
      <Route index element={<Blogs />} />
      <Route path=":slug" element={<BlogDetail />} />
      <Route path="category/:category" element={<BlogCategory />} />
      <Route path="editor" element={<BlogsEditor />} />
      <Route path="editor/new" element={<EditorNew />} />
      <Route path="editor/:id" element={<EditorEdit />} />
    </Routes>
  );
}
