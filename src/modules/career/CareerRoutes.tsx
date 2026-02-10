import { Routes, Route } from 'react-router-dom';
import { LayoutDashboard, Target, Map } from 'lucide-react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { GoalWizardProvider } from '@/modules/career/contexts/GoalWizardContext';
import { PathwayWizardProvider } from '@/modules/career/contexts/PathwayWizardContext';
import { ModuleLayout } from '@/core/layouts/ModuleLayout';
import DashboardPage from './pages/DashboardPage';
import GoalsPage from './pages/GoalsPage';
import PathwaysPage from './pages/PathwaysPage';
import RoadmapPage from './pages/RoadmapPage';

const careerNav = [
  { to: '/career', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/career/goals', icon: Target, label: 'Goals' },
  { to: '/career/pathways', icon: Map, label: 'Pathways' },
];

export function CareerRoutes() {
  return (
    <TooltipProvider>
      <GoalWizardProvider>
        <PathwayWizardProvider>
          <ModuleLayout title="Career Guru" navItems={careerNav}>
            <Routes>
              <Route index element={<DashboardPage />} />
              <Route path="goals" element={<GoalsPage />} />
              <Route path="pathways" element={<PathwaysPage />} />
              <Route path="roadmap/:id" element={<RoadmapPage />} />
            </Routes>
          </ModuleLayout>
        </PathwayWizardProvider>
      </GoalWizardProvider>
    </TooltipProvider>
  );
}
