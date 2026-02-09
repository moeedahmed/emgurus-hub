import { Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import GoalsPage from './pages/GoalsPage';
import PathwaysPage from './pages/PathwaysPage';
import RoadmapPage from './pages/RoadmapPage';

export function CareerRoutes() {
  return (
    <Routes>
      <Route index element={<DashboardPage />} />
      <Route path="goals" element={<GoalsPage />} />
      <Route path="pathways" element={<PathwaysPage />} />
      <Route path="roadmap/:id" element={<RoadmapPage />} />
    </Routes>
  );
}
