import { Routes, Route } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';
import { GoalWizardProvider } from '@/modules/career/contexts/GoalWizardContext';
import { PathwayWizardProvider } from '@/modules/career/contexts/PathwayWizardContext';
import DashboardPage from './pages/DashboardPage';
import GoalsPage from './pages/GoalsPage';
import PathwaysPage from './pages/PathwaysPage';
import RoadmapPage from './pages/RoadmapPage';

export function CareerRoutes() {
  return (
    <TooltipProvider>
      <GoalWizardProvider>
        <PathwayWizardProvider>
          <Routes>
            <Route index element={<DashboardPage />} />
            <Route path="goals" element={<GoalsPage />} />
            <Route path="pathways" element={<PathwaysPage />} />
            <Route path="roadmap/:id" element={<RoadmapPage />} />
          </Routes>
        </PathwayWizardProvider>
      </GoalWizardProvider>
    </TooltipProvider>
  );
}
