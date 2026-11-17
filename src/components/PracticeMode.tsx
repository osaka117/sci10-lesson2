import React, { useState, useEffect } from 'react';
import { Question, TopicId, DifficultyLevel } from '../types/physics';
import { TOPICS, DIFFICULTY_LEVELS, getTopicName, getDifficultyInfo } from '../data/topicsAndLevels';
import { generateQuestion } from '../data/questionGenerator';
import { MathView, MathText } from '../utils/mathRenderer';
import { retroAudio } from '../utils/retroAudio';
import { Check, X, ArrowRight, RotateCcw, Shuffle, Sparkles, Filter } from 'lucide-react';

export const PracticeMode: React.FC = () => {
  // Filter settings
  const [selectedTopics, setSelectedTopics] = useState<TopicId[]>([
    'momentum',
    'impulse',
    'impulse_momentum',
    'conservation',
    'real_life',
  ]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<DifficultyLevel[]>([1, 2, 3, 4, 5]);
  const [randomTopic, setRandomTopic] = useState<boolean>(true);
  const [randomDifficulty, setRandomDifficulty] = useState<boolean>(true);
  const [filtersOpen, setFiltersOpen] = useState<boolean>(true);

  // Current Question & Answer State
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  // Practice session statistics
  const [stats, setStats] = useState<{ total: number; correct: number }>({
    total: 0,
    correct: 0,
  });

  // Load question helper
  const loadNextQuestion = () => {
    retroAudio.playClick();
    setSelectedOptionId(null);
    setHasSubmitted(false);

    let topicFilter: TopicId[] | undefined = selectedTopics;
    let difficultyFilter: DifficultyLevel[] | undefined = selectedDifficulties;

    if (randomTopic) {
      topicFilter = undefined;
    }
    if (randomDifficulty) {
      difficultyFilter = undefined;
    }

    const q = generateQuestion(topicFilter, difficultyFilter);
    setCurrentQuestion(q);
  };

  // Initial load
  useEffect(() => {
    loadNextQuestion();
  }, []);

  // Answer selection handler
  const handleSelectOption = (optionId: string) => {
    if (hasSubmitted) return;
    setSelectedOptionId(optionId);
    setHasSubmitted(true);

    const isCorrect = optionId === currentQuestion?.correctAnswerId;
    if (isCorrect) {
      retroAudio.playCorrect();
    } else {
      retroAudio.playIncorrect();
    }

    setStats((prev) => ({
      total: prev.total + 1,
      correct: prev.correct + (isCorrect ? 1 : 0),
    }));
  };

  // Retry same question
  const handleRetry = () => {
    retroAudio.playClick();
    setSelectedOptionId(null);
    setHasSubmitted(false);
  };

  // Toggle topic in filter
  const toggleTopic = (tId: TopicId) => {
    retroAudio.playClick();
    setSelectedTopics((prev) => {
      if (prev.includes(tId)) {
        if (prev.length === 1) return prev; // Keep at least one
        return prev.filter((id) => id !== tId);
      }
      return [...prev, tId];
    });
  };

  // Toggle difficulty in filter
  const toggleDifficulty = (lvl: DifficultyLevel) => {
    retroAudio.playClick();
    setSelectedDifficulties((prev) => {
      if (prev.includes(lvl)) {
        if (prev.length === 1) return prev; // Keep at least one
        return prev.filter((l) => l !== lvl);
      }
      return [...prev, lvl];
    });
  };

  if (!currentQuestion) return null;

  const diffInfo = getDifficultyInfo(currentQuestion.difficulty);
  const isCorrect = selectedOptionId === currentQuestion.correctAnswerId;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Top Practice Sub-Header & Filters Bar */}
      <div className="retro-window p-3 md:p-4 bg-[#111e31]">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1f3758]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#00e5ff] inline-block"></span>
            <h1 className="text-sm md:text-base font-bold font-mono text-white tracking-wide">
              PRACTICE DRILL // STEP-BY-STEP CONCEPT MASTERY
            </h1>
          </div>

          {/* Session Statistics Ticker */}
          <div className="flex items-center gap-3 text-xs font-mono text-[#8aa3bf]">
            <div>
              <span>SOLVED: </span>
              <span className="text-white font-bold">{stats.total}</span>
            </div>
            <div>
              <span>CORRECT: </span>
              <span className="text-[#00e676] font-bold">{stats.correct}</span>
            </div>
            <div>
              <span>ACCURACY: </span>
              <span className="text-[#00e5ff] font-bold">
                {stats.total > 0
                  ? `${Math.round((stats.correct / stats.total) * 100)}%`
                  : '0%'}
              </span>
            </div>
            <button
              onClick={() => {
                retroAudio.playClick();
                setFiltersOpen(!filtersOpen);
              }}
              className="retro-btn px-2.5 py-1 text-xs flex items-center gap-1.5 ml-2"
            >
              <Filter className="w-3.5 h-3.5 text-[#00e5ff]" />
              <span>{filtersOpen ? 'Hide Filters' : 'Show Filters'}</span>
            </button>
          </div>
        </div>

        {/* Filter Configuration Panel (Automatically open) */}
        {filtersOpen && (
          <div className="pt-3 space-y-3 text-xs font-mono">
            {/* Topic multi-select */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[#8aa3bf] font-bold">SELECT TOPICS:</span>
                <label className="flex items-center gap-1.5 text-[#c0d4e8] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={randomTopic}
                    onChange={(e) => setRandomTopic(e.target.checked)}
                    className="accent-[#00e5ff]"
                  />
                  <span>Randomize Topic Selection</span>
                </label>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {TOPICS.map((topic) => {
                  const isSel = selectedTopics.includes(topic.id);
                  return (
                    <button
                      key={topic.id}
                      onClick={() => toggleTopic(topic.id)}
                      className={`px-2.5 py-1 text-xs border ${
                        isSel
                          ? 'bg-[#193556] text-[#00e5ff] border-[#00e5ff] font-bold'
                          : 'bg-[#09111c] text-[#5d738d] border-[#1b2d45]'
                      }`}
                    >
                      {topic.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Difficulty multi-select */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[#8aa3bf] font-bold">DIFFICULTY LEVELS:</span>
                <label className="flex items-center gap-1.5 text-[#c0d4e8] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={randomDifficulty}
                    onChange={(e) => setRandomDifficulty(e.target.checked)}
                    className="accent-[#00e5ff]"
                  />
                  <span>Randomize Difficulty Selection</span>
                </label>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {DIFFICULTY_LEVELS.map((lvl) => {
                  const isSel = selectedDifficulties.includes(lvl.level);
                  return (
                    <button
                      key={lvl.level}
                      onClick={() => toggleDifficulty(lvl.level)}
                      className={`px-2.5 py-1 text-xs border ${
                        isSel
                          ? 'bg-[#193556] text-white border-[#00e5ff] font-bold'
                          : 'bg-[#09111c] text-[#5d738d] border-[#1b2d45]'
                      }`}
                      style={{ color: isSel ? lvl.color : undefined }}
                    >
                      {lvl.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Action Button for Filters */}
            <div className="pt-1 flex items-center justify-between">
              <span className="text-[11px] text-[#5d738d]">
                Filters automatically apply to each new question generated.
              </span>
              <button
                onClick={loadNextQuestion}
                className="retro-btn-primary px-3 py-1 text-xs font-bold flex items-center gap-1.5"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>Load Question with Current Filters</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Question Terminal Window */}
      <div className="retro-window p-4 md:p-6 bg-[#0f1b2c] space-y-6">
        {/* Question Header Metadata */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#1f3758] text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-[#172942] border border-[#2b4b73] text-[#00e5ff] font-bold">
              {getTopicName(currentQuestion.topicId)}
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

          <div className="text-[#8aa3bf]">
            {currentQuestion.isConceptual ? 'CONCEPTUAL QUESTION' : 'NUMERICAL PROBLEM'}
          </div>
        </div>

        {/* Problem Statement Box */}
        <div className="p-4 md:p-5 retro-window-inner text-white text-sm md:text-base leading-relaxed">
          <h2 className="text-xs uppercase tracking-wider text-[#ffb703] font-bold mb-2 font-mono">
            Problem Description:
          </h2>
          <div className="text-white font-sans text-base md:text-lg">
            <MathText text={currentQuestion.problemStatement} />
          </div>

          {/* Given Values Pill Strip */}
          {currentQuestion.givenValues && currentQuestion.givenValues.length > 0 && (
            <div className="mt-4 pt-3 border-t border-[#1a2d45] flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="text-[#8aa3bf]">GIVEN:</span>
              {currentQuestion.givenValues.map((g, i) => (
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

        {/* Multiple Choice Options Grid */}
        <div className="space-y-3">
          <div className="text-xs font-mono text-[#8aa3bf] uppercase tracking-wider">
            Select Your Answer (A, B, C, or D):
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentQuestion.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              const isOptionCorrect = opt.id === currentQuestion.correctAnswerId;

              let btnStyle = 'bg-[#142338] border-[#254168] text-[#e2eaf2] hover:bg-[#1b2f4a]';

              if (hasSubmitted) {
                if (isOptionCorrect) {
                  btnStyle = 'bg-[#06331e] border-[#00e676] text-[#00e676] font-bold ring-1 ring-[#00e676]';
                } else if (isSelected) {
                  btnStyle = 'bg-[#3b0d11] border-[#ff5252] text-[#ff5252] font-bold';
                } else {
                  btnStyle = 'bg-[#0d1624] border-[#1b2e46] text-[#556b82] opacity-60';
                }
              }

              return (
                <button
                  key={opt.id}
                  disabled={hasSubmitted}
                  onClick={() => handleSelectOption(opt.id)}
                  className={`p-3 md:p-4 text-left border-2 flex items-start gap-3 transition-all cursor-pointer ${btnStyle}`}
                >
                  <span className="w-6 h-6 shrink-0 flex items-center justify-center font-bold text-xs font-mono border border-current">
                    {opt.id}
                  </span>
                  <div className="flex-1 text-sm md:text-base self-center">
                    <MathText text={opt.text} />
                  </div>
                  {hasSubmitted && isOptionCorrect && (
                    <Check className="w-5 h-5 text-[#00e676] shrink-0 self-center" />
                  )}
                  {hasSubmitted && isSelected && !isOptionCorrect && (
                    <X className="w-5 h-5 text-[#ff5252] shrink-0 self-center" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Detailed Step-by-Step Explanation Banner (Renders after answering) */}
        {hasSubmitted && (
          <div className="mt-6 p-4 md:p-5 border-2 border-[#1f3d64] bg-[#0b1422] space-y-4">
            {/* Result Verdict Indicator */}
            <div className="flex items-center justify-between pb-3 border-b border-[#1d314d]">
              <div className="flex items-center gap-2">
                {isCorrect ? (
                  <>
                    <div className="w-5 h-5 bg-[#00e676] flex items-center justify-center text-black font-bold text-xs">
                      ✓
                    </div>
                    <span className="font-bold text-sm md:text-base text-[#00e676] font-mono">
                      CORRECT! EXCELLENT APPLICATION.
                    </span>
                  </>
                ) : (
                  <>
                    <div className="w-5 h-5 bg-[#ff5252] flex items-center justify-center text-white font-bold text-xs">
                      ✕
                    </div>
                    <span className="font-bold text-sm md:text-base text-[#ff5252] font-mono">
                      INCORRECT. REVIEW THE STEP-BY-STEP SOLUTION BELOW.
                    </span>
                  </>
                )}
              </div>

              <div className="text-xs font-mono text-[#8aa3bf]">
                CORRECT OPTION: [ {currentQuestion.correctAnswerId} ]
              </div>
            </div>

            {/* Formula Used & Justification */}
            <div className="p-3 bg-[#0f1b2c] border border-[#233b5c] space-y-1 text-xs md:text-sm font-mono">
              <div className="text-[#ffb703] font-bold">
                PHYSICS FORMULA USED:
              </div>
              <div className="text-lg text-[#00e5ff] font-bold">
                <MathView math={currentQuestion.formulaUsed} />
              </div>
              <p className="text-[#a9c2db] font-sans text-xs pt-1">
                {currentQuestion.formulaReason}
              </p>
            </div>

            {/* Steps Breakdown */}
            <div className="space-y-2">
              <div className="text-xs font-mono text-[#8aa3bf] uppercase tracking-wider">
                Step-by-Step Solution:
              </div>
              {currentQuestion.steps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-[#111e31] border border-[#1d3350] text-xs md:text-sm font-mono"
                >
                  <span className="text-[#00e5ff] font-bold block mb-1">
                    {step.label}
                  </span>
                  <div className="text-[#e2eaf2]">
                    <MathText text={step.detail} />
                  </div>
                </div>
              ))}
            </div>

            {/* Key Grade 10 Takeaway */}
            <div className="p-3 bg-[#142338] border border-[#2c4c78] text-xs md:text-sm font-mono">
              <span className="text-[#ffb703] font-bold block mb-1">
                KEY GRADE 10 TAKEAWAY:
              </span>
              <p className="text-[#c8d9ea] font-sans">
                {currentQuestion.takeaway}
              </p>
            </div>

            {/* Navigation / Next / Retry Actions */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={handleRetry}
                className="retro-btn px-4 py-2 text-xs font-bold flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry This Question</span>
              </button>

              <button
                onClick={loadNextQuestion}
                className="retro-btn-primary px-6 py-2 text-xs font-bold flex items-center gap-2"
              >
                <span>Next Question</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
