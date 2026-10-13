export type AppTab = 'home' | 'intro' | 'cpr' | 'choking' | 'aed' | 'quiz';

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ChokingDiagnosticCase {
  id: number;
  scenario: string;
  signs: string[];
  correctType: 'mild' | 'severe';
  explanation: string;
}
