import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ReportCard } from '@/modules/exam/components/exams/ReportCard';

interface ExamReportState {
  attemptId: string;
  score: {
    correct: number;
    total: number;
    percentage: number;
  };
  duration: {
    seconds: number;
    formatted: string;
  };
  exam: {
    name: string;
    topic?: string;
  };
}

export default function ExamReport() {
  const location = useLocation();
  const navigate = useNavigate();
  const reportData = location.state as ExamReportState | null;

  useEffect(() => {
    document.title = "Exam Results • EM Gurus";
  }, []);

  // Redirect if no report data
  useEffect(() => {
    if (!reportData) {
      navigate('/exam', { replace: true });
    }
  }, [reportData, navigate]);

  if (!reportData) {
    return null;
  }

  const handleRetake = () => {
    navigate('/exam/config');
  };

  const handleViewAttempts = () => {
    navigate('/dashboard/user#exams-attempts');
  };

  const handleBackToExams = () => {
    navigate('/exam');
  };

  return (
    <ReportCard
      attemptId={reportData.attemptId}
      score={reportData.score}
      duration={reportData.duration}
      exam={reportData.exam}
      onRetake={handleRetake}
      onViewAttempts={handleViewAttempts}
      onBackToExams={handleBackToExams}
    />
  );
}
