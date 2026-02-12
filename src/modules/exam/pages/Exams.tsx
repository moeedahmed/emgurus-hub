import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Clock, Zap, BookOpen, BarChart3, Target } from "lucide-react";

export default function Exams() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Exams | EM Gurus";
    const desc = "Practice MCQs and prepare for emergency medicine exams worldwide.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { 
      meta = document.createElement('meta'); 
      meta.setAttribute('name','description'); 
      document.head.appendChild(meta); 
    }
    meta.setAttribute('content', desc);
  }, []);

  return (
    <main className="px-4 sm:px-6 py-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Dashboard header */}
        <div>
          <h1 className="heading-xl mb-2">Exam Guru</h1>
          <p className="text-muted-foreground">Practice MCQs and prepare for emergency medicine exams worldwide.</p>
        </div>

        {/* Mode cards */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* AI Mode */}
          <Card className="relative overflow-hidden group hover:shadow-strong transition-all duration-300 bg-gradient-card border-0 flex flex-col h-full">
            <div className="p-6 flex flex-col h-full">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">AI Mode</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full border bg-primary/10 text-primary">Beta</span>
                </div>
              </div>
              
              <ul className="space-y-2.5 mb-6 flex-grow text-sm text-muted-foreground">
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 mt-1.5 flex-shrink-0"></div>
                  <span>AI-generated questions on demand</span>
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 mt-1.5 flex-shrink-0"></div>
                  <span>Instant explanations and feedback</span>
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 mt-1.5 flex-shrink-0"></div>
                  <span>Customizable by exam and topic</span>
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 mt-1.5 flex-shrink-0"></div>
                  <span>Dynamic difficulty adjustment</span>
                </li>
              </ul>
              
              <Button 
                size="lg" 
                className="w-full mt-auto"
                onClick={() => navigate('/exam/ai/config')}
              >
                Start AI Mode
              </Button>
            </div>
          </Card>

          {/* Study Mode */}
          <Card className="relative overflow-hidden group hover:shadow-strong transition-all duration-300 bg-gradient-card border-0 flex flex-col h-full">
            <div className="p-6 flex flex-col h-full">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold">Study Mode</h3>
              </div>
              
              <ul className="space-y-2.5 mb-6 flex-grow text-sm text-muted-foreground">
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 mt-1.5 flex-shrink-0"></div>
                  <span>Curated questions from expert reviewers</span>
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 mt-1.5 flex-shrink-0"></div>
                  <span>See answers and explanations immediately</span>
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 mt-1.5 flex-shrink-0"></div>
                  <span>Untimed learning experience</span>
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 mt-1.5 flex-shrink-0"></div>
                  <span>Navigate freely between questions</span>
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 mt-1.5 flex-shrink-0"></div>
                  <span>AI Guru assistance available</span>
                </li>
              </ul>
              
              <Button 
                size="lg" 
                className="w-full mt-auto"
                onClick={() => navigate('/exam/practice/config')}
              >
                Start Study Session
              </Button>
            </div>
          </Card>

          {/* Exam Mode */}
          <Card className="relative overflow-hidden group hover:shadow-strong transition-all duration-300 bg-gradient-card border-0 flex flex-col h-full">
            <div className="p-6 flex flex-col h-full">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold">Exam Mode</h3>
              </div>
              
              <ul className="space-y-2.5 mb-6 flex-grow text-sm text-muted-foreground">
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 mt-1.5 flex-shrink-0"></div>
                  <span>Timed practice exams</span>
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 mt-1.5 flex-shrink-0"></div>
                  <span>Realistic exam conditions</span>
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 mt-1.5 flex-shrink-0"></div>
                  <span>Complete score analysis</span>
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 mt-1.5 flex-shrink-0"></div>
                  <span>Mark questions for review</span>
                </li>
              </ul>
              
              <Button 
                size="lg" 
                className="w-full mt-auto"
                onClick={() => navigate('/exam/config')}
              >
                Start Exam
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
