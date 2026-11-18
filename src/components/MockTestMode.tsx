import React, { useState, useEffect } from 'react';
import { Question, TopicId, DifficultyLevel, MockTestResult } from '../types/physics';
import { TOPICS, DIFFICULTY_LEVELS, getTopicName, getDifficultyInfo } from '../data/topicsAndLevels';
import { generateMockTestQuestions } from '../data/questionGenerator';
import { MathView, MathText } from '../utils/mathRenderer';
import { retroAudio } from '../utils/retroAudio';
import { GufsaSolutionPanel } from './GufsaSolutionPanel';
import { 
  Play, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw, 
  Award, 
  ChevronRight,
  Clock
} from 'lucide-react';

export const MockTestMode: React.FC = () => {
  // Test Lifecycle: 'config' | 'active' | 'review'
  const [testState, setTestState] = useState<'config' | 'active' | 'review'>('config');

  // Configuration options
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [selectedTopics, setSelectedTopics] = useState<TopicId[]>([
    'momentum',
    'impulse',
    'impulse_momentum',
    'conservation',
    'real_life',
  ]);

  // Active test state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({}); // questionId -> optionId ('A', 'B', ...)
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  // Review state
  const [testResult, setTestResult] = useState<MockTestResult | null>(null);
  const [reviewIndex, setReviewIndex] = useState<number>(0);

  // Timer effect for active test
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (testState === 'active') {
      timer = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [testState]);

  // Start test
  const handleStartTest = () => {
    retroAudio.playClick();
    const generated = generateMockTestQuestions(questionCount, selectedTopics);
    setQuestions(generated);
    setCurrentIndex(0);
    setUserAnswers({});
    setElapsedSeconds(0);
    setTestState('active');
  };

  // Toggle topics in configuration
  const toggleTopic = (id: TopicId) => {
    retroAudio.playClick();
    setSelectedTopics((prev) => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev;
        return prev.filter((t) => t !== id);
      }
      return [...prev, id];
    });
  };

  // Select option in active test
  const handleAnswerSelect = (optionId: string) => {
    retroAudio.playClick();
    const currentQ = questions[currentIndex];
    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionId,
    }));
  };

  // Navigate between questions
  const goToQuestion = (index: number) => {
    retroAudio.playClick();
    if (index >= 0 && index < questions.length) {
      setCurrentIndex(index);
    }
  };

  // Check unanswered count
  const unansweredCount = questions.length - Object.keys(userAnswers).length;

  // Submit test and generate result
  const handleSubmitTest = () => {
    retroAudio.playTestComplete();
    setShowConfirmModal(false);

    let correctCount = 0;
    const topicBreakdown: Record<TopicId, { total: number; correct: number }> = {
      momentum: { total: 0, correct: 0 },
      impulse: { total: 0, correct: 0 },
      impulse_momentum: { total: 0, correct: 0 },
      conservation: { total: 0, correct: 0 },
      real_life: { total: 0, correct: 0 },
    };

    const difficultyBreakdown: Record<DifficultyLevel, { total: number; correct: number }> = {
      1: { total: 0, correct: 0 },
      2: { total: 0, correct: 0 },
      3: { total: 0, correct: 0 },
      4: { total: 0, correct: 0 },
      5: { total: 0, correct: 0 },
    };

    questions.forEach((q) => {
      const isCorrect = userAnswers[q.id] === q.correctAnswerId;
      if (isCorrect) correctCount++;

      // Breakdown by topic
      if (topicBreakdown[q.topicId]) {
        topicBreakdown[q.topicId].total++;
        if (isCorrect) topicBreakdown[q.topicId].correct++;
      }

      // Breakdown by difficulty
      if (difficultyBreakdown[q.difficulty]) {
        difficultyBreakdown[q.difficulty].total++;
        if (isCorrect) difficultyBreakdown[q.difficulty].correct++;
      }
    });

    const scorePercentage = Math.round((correctCount / questions.length) * 100);

    const result: MockTestResult = {
      totalQuestions: questions.length,
      correctCount,
      scorePercentage,
      timeTakenSeconds: elapsedSeconds,
      userAnswers,
      questions,
      topicBreakdown,
      difficultyBreakdown,
    };

    setTestResult(result);
    setReviewIndex(0);
    setTestState('review');
  };

  // Format timer seconds to mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // ==========================================
  // VIEW 1: CONFIGURATION SCREEN
  // ==========================================
  if (testState === 'config') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="retro-window p-5 md:p-6 bg-[#0f1b2c] space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-[#1f3758]">
            <Award className="w-5 h-5 text-[#ffb703]" />
            <div>
              <h1 className="text-base md:text-lg font-bold font-mono text-white">
                MOCK TEST SETUP // SIMULATED GRADE 10 EXAM
              </h1>
              <p className="text-xs text-[#8aa3bf] font-mono">
                Independent difficulty randomization • Zero repeat questions • Comprehensive diagnostic review
              </p>
            </div>
          </div>

          {/* Question Count Selection */}
          <div className="space-y-2">
            <span className="text-xs font-mono text-[#ffb703] font-bold uppercase tracking-wider">
              1. Choose Number of Questions:
            </span>
            <div className="flex flex-wrap gap-2">
              {[5, 10, 15, 20, 25, 30].map((count) => (
                <button
                  key={count}
                  onClick={() => {
                    retroAudio.playClick();
                    setQuestionCount(count);
                  }}
                  className={`px-4 py-2 text-xs font-bold font-mono border-2 transition-all ${
                    questionCount === count
                      ? 'bg-[#00e5ff] text-[#080e18] border-[#00e5ff]'
                      : 'bg-[#152336] text-[#c0d4e8] border-[#233b5c] hover:bg-[#1b2f48]'
                  }`}
                >
                  {count} Questions
                </button>
              ))}
            </div>
          </div>

          {/* Topic Inclusions */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#ffb703] font-bold uppercase tracking-wider">
                2. Select Topics to Include:
              </span>
              <button
                onClick={() => {
                  retroAudio.playClick();
                  setSelectedTopics([
                    'momentum',
                    'impulse',
                    'impulse_momentum',
                    'conservation',
                    'real_life',
                  ]);
                }}
                className="text-xs text-[#00e5ff] underline hover:text-white font-mono"
              >
                Select All Topics
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              {TOPICS.map((topic) => {
                const isSelected = selectedTopics.includes(topic.id);
                return (
                  <button
                    key={topic.id}
                    onClick={() => toggleTopic(topic.id)}
                    className={`p-3 text-left border-2 flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-[#142944] border-[#00e5ff] text-white'
                        : 'bg-[#09111c] border-[#1b2d45] text-[#5d738d]'
                    }`}
                  >
                    <div>
                      <span className="font-bold block">{topic.name}</span>
                      <span className="text-[10px] text-[#8aa3bf]">{topic.code}</span>
                    </div>
                    <span className="w-4 h-4 border border-current flex items-center justify-center text-[10px]">
                      {isSelected ? '✓' : ''}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Randomization Guarantee Note */}
          <div className="p-3 bg-[#0b1422] border border-[#1e344f] text-xs font-mono text-[#8aa3bf] space-y-1">
            <span className="text-[#00e676] font-bold block">
              GRADE 10 EXAM PROTOCOL:
            </span>
            <p>
              • Difficulty is randomized independently per question across all 5 levels (Basic to Difficult).
            </p>
            <p>
              • No progressive steepening — questions are realistically distributed as in a standard standardized test.
            </p>
            <p>
              • You may freely navigate between questions and modify answers prior to submission.
            </p>
          </div>

          {/* Start Test Action */}
          <div className="pt-2">
            <button
              onClick={handleStartTest}
              className="retro-btn-primary w-full py-3 text-sm font-bold font-mono flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" />
              <span>START MOCK TEST ({questionCount} QUESTIONS)</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: ACTIVE TEST IN PROGRESS
  // ==========================================
  if (testState === 'active') {
    const currentQ = questions[currentIndex];
    const diffInfo = getDifficultyInfo(currentQ.difficulty);
    const selectedOption = userAnswers[currentQ.id];

    return (
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Test Navigation Bar & Status Header */}
        <div className="retro-window p-3 md:p-4 bg-[#111e31]">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1f3758] text-xs font-mono">
            <div className="flex items-center gap-3">
              <span className="text-[#00e5ff] font-bold">
                QUESTION {currentIndex + 1} OF {questions.length}
              </span>
              <span className="text-[#8aa3bf]">|</span>
              <span className="text-[#ffb703]">
                ANSWERED: {Object.keys(userAnswers).length} / {questions.length}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-white">
                <Clock className="w-3.5 h-3.5 text-[#00e5ff]" />
                <span className="font-bold">{formatTime(elapsedSeconds)}</span>
              </div>
              <button
                onClick={() => {
                  retroAudio.playClick();
                  setShowConfirmModal(true);
                }}
                className="retro-btn-primary px-3 py-1 text-xs font-bold"
              >
                Submit Exam
              </button>
            </div>
          </div>

          {/* Question Navigator Grid */}
          <div className="pt-3">
            <div className="text-[11px] font-mono text-[#8aa3bf] mb-1.5 flex items-center justify-between">
              <span>QUESTION NAVIGATOR:</span>
              <span className="text-[10px] text-[#5d738d]">
                Cyan = Answered • Outline = Current • Charcoal = Unanswered
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {questions.map((q, idx) => {
                const isAnswered = !!userAnswers[q.id];
                const isCurrent = idx === currentIndex;

                let btnStyle = 'bg-[#09111c] text-[#8aa3bf] border-[#1b2d45]';
                if (isCurrent) {
                  btnStyle = 'border-2 border-[#00e5ff] text-white font-bold bg-[#142944]';
                } else if (isAnswered) {
                  btnStyle = 'bg-[#005260] text-white border-[#00c4db] font-bold';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => goToQuestion(idx)}
                    className={`w-8 h-8 text-xs font-mono flex items-center justify-center border transition-all ${btnStyle}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Question Terminal Card */}
        <div className="retro-window p-4 md:p-6 bg-[#0f1b2c] space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#1f3758] text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-[#172942] border border-[#2b4b73] text-[#00e5ff] font-bold">
                {getTopicName(currentQ.topicId)}
              </span>
              <span
                className="px-2 py-0.5 border font-bold"
                style={{
                  borderColor: diffInfo.color,
                  color: diffInfo.color,
                  backgroundColor: '#09111c',
                }}
              >
                {diffInfo.name}
              </span>
            </div>
            <span className="text-[#8aa3bf]">
              {selectedOption ? `Marked Choice: [ ${selectedOption} ]` : 'UNANSWERED'}
            </span>
          </div>

          {/* Problem Statement */}
          <div className="p-4 md:p-5 retro-window-inner text-white text-base md:text-lg leading-relaxed font-sans">
            <MathText text={currentQ.problemStatement} />

            {currentQ.givenValues && currentQ.givenValues.length > 0 && (
              <div className="mt-4 pt-3 border-t border-[#1a2d45] flex flex-wrap items-center gap-2 text-xs font-mono">
                <span className="text-[#8aa3bf]">GIVEN:</span>
                {currentQ.givenValues.map((g, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-[#0e1928] border border-[#233b5c] text-[#c0d4e8]"
                  >
                    <MathView math={g.symbol} /> = {g.value} {g.unit}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Choices Options */}
          <div className="space-y-3">
            <div className="text-xs font-mono text-[#8aa3bf] uppercase tracking-wider">
              Choose an answer (can be changed anytime before submission):
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentQ.options.map((opt) => {
                const isSelected = selectedOption === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleAnswerSelect(opt.id)}
                    className={`p-3 md:p-4 text-left border-2 flex items-start gap-3 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#0f344d] border-[#00e5ff] text-white ring-1 ring-[#00e5ff]'
                        : 'bg-[#142338] border-[#254168] text-[#e2eaf2] hover:bg-[#1b2f4a]'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 shrink-0 flex items-center justify-center font-bold text-xs font-mono border ${
                        isSelected ? 'bg-[#00e5ff] text-black border-[#00e5ff]' : 'border-current'
                      }`}
                    >
                      {opt.id}
                    </span>
                    <div className="flex-1 text-sm md:text-base self-center">
                      <MathText text={opt.text} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Next / Prev Step Controls */}
          <div className="pt-4 border-t border-[#1f3758] flex items-center justify-between">
            <button
              disabled={currentIndex === 0}
              onClick={() => goToQuestion(currentIndex - 1)}
              className="retro-btn px-4 py-2 text-xs font-bold font-mono flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() => goToQuestion(currentIndex + 1)}
                className="retro-btn-primary px-5 py-2 text-xs font-bold font-mono flex items-center gap-1.5"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => {
                  retroAudio.playClick();
                  setShowConfirmModal(true);
                }}
                className="retro-btn-primary px-5 py-2 text-xs font-bold font-mono bg-[#008196] border-[#00e5ff] flex items-center gap-1.5"
              >
                <span>Finish &amp; Submit</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Confirmation Modal prior to submission */}
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
            <div className="retro-window w-full max-w-md p-5 bg-[#111e31] space-y-4">
              <div className="flex items-center gap-2 text-[#ffb703] font-bold text-sm font-mono border-b border-[#233b5c] pb-2">
                <AlertCircle className="w-4 h-4 text-[#ffb703]" />
                <span>CONFIRM TEST SUBMISSION</span>
              </div>

              <div className="text-xs font-mono text-[#c0d4e8] space-y-2">
                <p>
                  You are about to finish the mock test.
                </p>
                {unansweredCount > 0 ? (
                  <div className="p-3 bg-[#331114] border border-[#ff5252] text-[#ff5252]">
                    ⚠️ ATTENTION: You still have <strong>{unansweredCount}</strong> unanswered question(s)!
                  </div>
                ) : (
                  <div className="p-2.5 bg-[#082b1d] border border-[#00e676] text-[#00e676]">
                    ✓ All {questions.length} questions have been answered.
                  </div>
                )}
                <p className="text-[#8aa3bf]">
                  Elapsed Time: {formatTime(elapsedSeconds)}
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="retro-btn px-3 py-1.5 text-xs font-mono"
                >
                  Return to Questions
                </button>
                <button
                  onClick={handleSubmitTest}
                  className="retro-btn-primary px-4 py-1.5 text-xs font-mono font-bold"
                >
                  Confirm &amp; Grade
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // VIEW 3: RESULTS & DIAGNOSTIC REVIEW SCREEN
  // ==========================================
  if (testState === 'review' && testResult) {
    const activeReviewQ = testResult.questions[reviewIndex];
    const userSelectedOpt = testResult.userAnswers[activeReviewQ.id];
    const isQCorrect = userSelectedOpt === activeReviewQ.correctAnswerId;
    const diffInfo = getDifficultyInfo(activeReviewQ.difficulty);

    return (
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Scorecard Banner */}
        <div className="retro-window p-5 md:p-6 bg-[#0f1b2c] space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#1f3758]">
            <div className="space-y-1">
              <span className="text-xs font-mono text-[#00e5ff] uppercase tracking-wider">
                MOCK TEST RESULTS REPORT
              </span>
              <h1 className="text-2xl md:text-3xl font-bold font-mono text-white">
                FINAL SCORE: {testResult.correctCount} / {testResult.totalQuestions}{' '}
                <span className="text-[#00e5ff]">({testResult.scorePercentage}%)</span>
              </h1>
              <p className="text-xs font-mono text-[#8aa3bf]">
                Duration: {formatTime(testResult.timeTakenSeconds)} • Grade 10 Benchmark
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  retroAudio.playClick();
                  setTestState('config');
                }}
                className="retro-btn px-4 py-2 text-xs font-mono font-bold flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Configure New Test</span>
              </button>
            </div>
          </div>

          {/* Performance Diagnostics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            {/* Topic Breakdown */}
            <div className="p-3.5 bg-[#111e31] border border-[#233b5c] space-y-2">
              <span className="text-[#ffb703] font-bold block uppercase tracking-wider">
                Topic Performance Breakdown:
              </span>
              <div className="space-y-1.5">
                {TOPICS.map((topic) => {
                  const data = testResult.topicBreakdown[topic.id];
                  if (!data || data.total === 0) return null;
                  const pct = Math.round((data.correct / data.total) * 100);
                  return (
                    <div key={topic.id} className="flex items-center justify-between text-[#c0d4e8]">
                      <span className="truncate pr-2">{topic.name}</span>
                      <span className="font-bold text-white shrink-0">
                        {data.correct}/{data.total} ({pct}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Difficulty Breakdown */}
            <div className="p-3.5 bg-[#111e31] border border-[#233b5c] space-y-2">
              <span className="text-[#00e676] font-bold block uppercase tracking-wider">
                Difficulty Level Performance:
              </span>
              <div className="space-y-1.5">
                {DIFFICULTY_LEVELS.map((lvl) => {
                  const data = testResult.difficultyBreakdown[lvl.level];
                  if (!data || data.total === 0) return null;
                  const pct = Math.round((data.correct / data.total) * 100);
                  return (
                    <div key={lvl.level} className="flex items-center justify-between text-[#c0d4e8]">
                      <span style={{ color: lvl.color }}>{lvl.name}</span>
                      <span className="font-bold text-white shrink-0">
                        {data.correct}/{data.total} ({pct}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Question Review Section */}
        <div className="retro-window p-4 md:p-6 bg-[#0f1b2c] space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1f3758] text-xs font-mono">
            <span className="font-bold text-white uppercase tracking-wider">
              REVIEW QUESTIONS (CLICK ANY NUMBER TO INSPECT):
            </span>
            <span className="text-[#8aa3bf]">
              Green = Correct • Red = Incorrect / Skipped
            </span>
          </div>

          {/* Question Selector Strip */}
          <div className="flex flex-wrap gap-1.5">
            {testResult.questions.map((q, idx) => {
              const userOpt = testResult.userAnswers[q.id];
              const isCorrect = userOpt === q.correctAnswerId;
              const isSelected = idx === reviewIndex;

              return (
                <button
                  key={q.id}
                  onClick={() => {
                    retroAudio.playClick();
                    setReviewIndex(idx);
                  }}
                  className={`w-8 h-8 text-xs font-mono font-bold flex items-center justify-center border transition-all ${
                    isCorrect
                      ? isSelected
                        ? 'bg-[#00e676] text-black border-white ring-2 ring-white'
                        : 'bg-[#084224] text-[#00e676] border-[#00e676]'
                      : isSelected
                      ? 'bg-[#ff5252] text-white border-white ring-2 ring-white'
                      : 'bg-[#401217] text-[#ff5252] border-[#ff5252]'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Active Review Question Card */}
          <div className="p-4 md:p-5 border border-[#233b5c] bg-[#0b1422] space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#1d314d] text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">
                  QUESTION {reviewIndex + 1} OF {testResult.totalQuestions}
                </span>
                <span className="px-2 py-0.5 bg-[#172942] text-[#00e5ff]">
                  {getTopicName(activeReviewQ.topicId)}
                </span>
                <span style={{ color: diffInfo.color }}>
                  {diffInfo.name}
                </span>
              </div>

              <div>
                {isQCorrect ? (
                  <span className="text-[#00e676] font-bold">✓ YOU ANSWERED CORRECTLY</span>
                ) : (
                  <span className="text-[#ff5252] font-bold">
                    ✕ {userSelectedOpt ? 'INCORRECT ANSWER' : 'QUESTION SKIPPED'}
                  </span>
                )}
              </div>
            </div>

            {/* Problem Statement */}
            <div className="text-white text-base font-sans leading-relaxed">
              <MathText text={activeReviewQ.problemStatement} />
            </div>

            {/* Options display with annotations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-2">
              {activeReviewQ.options.map((opt) => {
                const isCorrectChoice = opt.id === activeReviewQ.correctAnswerId;
                const isUserChoice = opt.id === userSelectedOpt;

                let optClass = 'bg-[#111e31] border-[#1d334f] text-[#8aa3bf]';
                if (isCorrectChoice) {
                  optClass = 'bg-[#06331e] border-[#00e676] text-[#00e676] font-bold';
                } else if (isUserChoice && !isCorrectChoice) {
                  optClass = 'bg-[#3b0d11] border-[#ff5252] text-[#ff5252] font-bold';
                }

                return (
                  <div
                    key={opt.id}
                    className={`p-3 border-2 flex items-start gap-2.5 text-xs md:text-sm ${optClass}`}
                  >
                    <span className="w-5 h-5 font-mono font-bold flex items-center justify-center border border-current shrink-0">
                      {opt.id}
                    </span>
                    <div className="flex-1">
                      <MathText text={opt.text} />
                    </div>
                    {isCorrectChoice && <span className="text-[10px] shrink-0 font-mono">(KEY)</span>}
                    {isUserChoice && <span className="text-[10px] shrink-0 font-mono">(YOURS)</span>}
                  </div>
                );
              })}
            </div>

            {/* Full Step-by-Step Solution (GUFSA when wrong or skipped) */}
            <div className="mt-4 pt-3 border-t border-[#1d314d] space-y-3">
              {!isQCorrect ? (
                <GufsaSolutionPanel question={activeReviewQ} />
              ) : (
                <>
                  <div className="p-3 bg-[#0f1b2c] border border-[#233b5c] text-xs font-mono">
                    <span className="text-[#ffb703] font-bold block mb-1">
                      FORMULA APPLIED:
                    </span>
                    <div className="text-[#00e5ff] text-sm font-bold mb-1">
                      <MathView math={activeReviewQ.formulaUsed} />
                    </div>
                    <p className="text-[#8aa3bf] font-sans">
                      <MathText text={activeReviewQ.formulaReason} />
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    {activeReviewQ.steps.map((st, i) => (
                      <div key={i} className="p-2.5 bg-[#111e31] border border-[#1b2f48] text-xs font-mono">
                        <span className="text-[#00e5ff] font-bold block mb-0.5">{st.label}</span>
                        <div className="text-[#e2eaf2]">
                          <MathText text={st.detail} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-2.5 bg-[#142338] border border-[#2c4c78] text-xs font-mono">
                    <span className="text-[#ffb703] font-bold block mb-0.5">GRADE 10 TAKEAWAY:</span>
                    <p className="text-[#c8d9ea] font-sans">
                      <MathText text={activeReviewQ.takeaway} />
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Prev/Next Review Buttons */}
            <div className="pt-2 flex items-center justify-between">
              <button
                disabled={reviewIndex === 0}
                onClick={() => {
                  retroAudio.playClick();
                  setReviewIndex(reviewIndex - 1);
                }}
                className="retro-btn px-3 py-1.5 text-xs font-mono font-bold"
              >
                Previous Question
              </button>
              <button
                disabled={reviewIndex === testResult.totalQuestions - 1}
                onClick={() => {
                  retroAudio.playClick();
                  setReviewIndex(reviewIndex + 1);
                }}
                className="retro-btn-primary px-4 py-1.5 text-xs font-mono font-bold"
              >
                Next Question
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
