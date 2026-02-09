import { Routes, Route } from 'react-router-dom';
import ExamsPage from './pages/Exams';
import QuestionBankPage from './pages/QuestionBankPage';
import ExamConfig from './pages/ExamConfig';
import ExamSession from './pages/ExamSession';
import ExamReport from './pages/ExamReport';
import PracticeConfig from './pages/PracticeConfig';
import PracticeSession from './pages/PracticeSession';
import AiPracticeConfig from './pages/AiPracticeConfig';
import AiPracticeSession from './pages/AiPracticeSession';

export function ExamRoutes() {
  return (
    <Routes>
      <Route index element={<ExamsPage />} />
      <Route path="bank" element={<QuestionBankPage />} />
      <Route path="config" element={<ExamConfig />} />
      <Route path="session/:id" element={<ExamSession />} />
      <Route path="report/:id" element={<ExamReport />} />
      <Route path="practice/config" element={<PracticeConfig />} />
      <Route path="practice/session/:id" element={<PracticeSession />} />
      <Route path="ai/config" element={<AiPracticeConfig />} />
      <Route path="ai/session/:id" element={<AiPracticeSession />} />
    </Routes>
  );
}
