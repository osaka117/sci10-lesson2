export type TopicId = 
  | 'momentum' 
  | 'impulse' 
  | 'impulse_momentum' 
  | 'conservation' 
  | 'real_life';

export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;

export interface TopicInfo {
  id: TopicId;
  name: string;
  code: string;
  description: string;
  iconName: string;
}

export interface DifficultyInfo {
  level: DifficultyLevel;
  name: string;
  descriptor: string;
  color: string;
}

export interface QuestionOption {
  id: string; // 'A', 'B', 'C', 'D'
  text: string; // Can contain LaTeX, e.g., "$15\\text{ kg}\\cdot\\text{m/s}$"
}

export interface QuestionStep {
  label: string; // e.g. "Step 1: Identify Given Values"
  detail: string; // Formatted explanation with math
}

export interface Question {
  id: string;
  topicId: TopicId;
  difficulty: DifficultyLevel;
  title: string;
  problemStatement: string; // Contains LaTeX notation
  options: QuestionOption[];
  correctAnswerId: string;
  formulaUsed: string; // LaTeX formula e.g. "p = mv"
  formulaReason: string;
  givenValues: { symbol: string; value: string; unit: string }[];
  steps: QuestionStep[];
  takeaway: string;
  isConceptual: boolean;
}

export interface PracticeFilters {
  selectedTopics: TopicId[];
  selectedDifficulties: DifficultyLevel[];
  randomTopic: boolean;
  randomDifficulty: boolean;
}

export interface MockTestConfig {
  questionCount: number; // 5, 10, 15, 20, 25, 30
  selectedTopics: TopicId[];
  randomizeDifficulty: boolean;
}

export interface UserAnswer {
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  timeSpentSeconds: number;
}

export interface MockTestResult {
  totalQuestions: number;
  correctCount: number;
  scorePercentage: number;
  timeTakenSeconds: number;
  userAnswers: Record<string, string>; // questionId -> optionId
  questions: Question[];
  topicBreakdown: Record<TopicId, { total: number; correct: number }>;
  difficultyBreakdown: Record<DifficultyLevel, { total: number; correct: number }>;
}

export interface FormulaEntry {
  id: string;
  name: string;
  equation: string;
  latexEquation: string;
  topicId: TopicId;
  variables: { symbol: string; meaning: string; unit: string }[];
  whenToUse: string;
  exampleProblem: string;
  exampleSolution: string;
}
