import React, { useState } from 'react';
import { FORMULA_REFERENCE_ENTRIES } from '../data/formulaReference';
import { TOPICS } from '../data/topicsAndLevels';
import { MathView, MathText } from '../utils/mathRenderer';
import { X, Search, BookOpen, ChevronRight } from 'lucide-react';
import { retroAudio } from '../utils/retroAudio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const FormulaReferenceModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string>(FORMULA_REFERENCE_ENTRIES[0].id);

  if (!isOpen) return null;

  const filteredEntries = FORMULA_REFERENCE_ENTRIES.filter((entry) => {
    const matchesSearch =
      entry.name.toLowerCase().includes(search.toLowerCase()) ||
      entry.equation.toLowerCase().includes(search.toLowerCase()) ||
      entry.whenToUse.toLowerCase().includes(search.toLowerCase());
    const matchesTopic = selectedTopic === 'all' || entry.topicId === selectedTopic;
    return matchesSearch && matchesTopic;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-xs">
      <div 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="ref-window-title"
        className="retro-window w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden text-[#e2eaf2]"
      >
        {/* Retro Window Titlebar */}
        <div className="flex items-center justify-between px-3 py-2 bg-[#1a2c44] border-b-2 border-[#2b4870] select-none">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#00e5ff]" />
            <span id="ref-window-title" className="text-xs md:text-sm font-bold tracking-wider text-[#00e5ff]">
              PHYSICS_REF.EXE // GRADE 10 IMPULSE &amp; MOMENTUM FORMULARY
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                retroAudio.playClick();
                onClose();
              }}
              aria-label="Close formula reference"
              className="retro-btn px-2 py-0.5 text-xs font-bold text-[#ff5252] hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Toolbar & Filter Bar */}
        <div className="p-3 bg-[#0f1b2c] border-b border-[#233b5c] flex flex-wrap gap-2 items-center justify-between">
          <div className="flex items-center gap-2 w-full sm:w-auto flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#8aa3bf]" />
              <input
                type="text"
                placeholder="Search formulas or keywords (e.g. p = mv)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#09111c] border border-[#233b5c] text-[#e2eaf2] placeholder-[#5d738d] focus:outline-none focus:border-[#00e5ff]"
              />
            </div>
          </div>

          <div className="flex items-center gap-1 overflow-x-auto text-xs py-1">
            <button
              onClick={() => {
                retroAudio.playClick();
                setSelectedTopic('all');
              }}
              className={`px-2.5 py-1 text-xs border ${
                selectedTopic === 'all'
                  ? 'bg-[#00e5ff] text-[#080e18] font-bold border-[#00e5ff]'
                  : 'bg-[#152336] text-[#8aa3bf] border-[#233b5c] hover:text-white'
              }`}
            >
              All Topics
            </button>
            {TOPICS.map((topic) => (
              <button
                key={topic.id}
                onClick={() => {
                  retroAudio.playClick();
                  setSelectedTopic(topic.id);
                }}
                className={`px-2.5 py-1 text-xs whitespace-nowrap border ${
                  selectedTopic === topic.id
                    ? 'bg-[#00e5ff] text-[#080e18] font-bold border-[#00e5ff]'
                    : 'bg-[#152336] text-[#8aa3bf] border-[#233b5c] hover:text-white'
                }`}
              >
                {topic.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Formula Cards Content Body */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1 bg-[#0b1422]">
          {filteredEntries.length === 0 ? (
            <div className="p-8 text-center text-[#8aa3bf] text-sm">
              No matching formula found for &quot;{search}&quot;. Try searching for &quot;momentum&quot; or &quot;impulse&quot;.
            </div>
          ) : (
            filteredEntries.map((entry) => {
              const isExpanded = expandedId === entry.id;
              return (
                <div
                  key={entry.id}
                  className="border-2 border-[#1e344f] bg-[#111e31] p-3 md:p-4 transition-colors"
                >
                  <div
                    onClick={() => {
                      retroAudio.playClick();
                      setExpandedId(isExpanded ? '' : entry.id);
                    }}
                    className="flex flex-wrap items-center justify-between gap-3 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <ChevronRight
                        className={`w-4 h-4 text-[#00e5ff] transition-transform ${
                          isExpanded ? 'rotate-90' : ''
                        }`}
                      />
                      <span className="font-bold text-sm md:text-base text-white">
                        {entry.name}
                      </span>
                    </div>

                    <div className="px-3 py-1 bg-[#080e18] border border-[#233b5c] text-sm md:text-base font-mono text-[#00e5ff]">
                      <MathView math={entry.latexEquation} />
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 pt-3 border-t border-[#1d314b] space-y-3 text-xs md:text-sm">
                      {/* Variables breakdown */}
                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-[#ffb703] mb-1.5">
                          Variable Meanings &amp; SI Units
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                          {entry.variables.map((v, i) => (
                            <div
                              key={i}
                              className="p-2 bg-[#09121d] border border-[#1b2d45] flex flex-col justify-between"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-[#00e5ff]">
                                  <MathView math={v.symbol} />
                                </span>
                                <span className="text-[11px] font-mono text-[#00e676]">
                                  [{v.unit}]
                                </span>
                              </div>
                              <span className="text-[#8aa3bf] text-[11px] mt-1">
                                {v.meaning}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* When to use */}
                      <div className="p-2.5 bg-[#0e1a2b] border border-[#1d334f]">
                        <span className="font-bold text-[#ffb703] block mb-1">
                          When to Apply in Grade 10:
                        </span>
                        <p className="text-[#c7d5e4] leading-relaxed">
                          {entry.whenToUse}
                        </p>
                      </div>

                      {/* Worked Example */}
                      <div className="p-3 bg-[#080f19] border border-[#203653]">
                        <span className="font-bold text-[#00e5ff] block mb-1 text-[11px] uppercase tracking-wider">
                          Worked Example Problem:
                        </span>
                        <div className="text-[#e2eaf2] mb-2 font-sans italic">
                          <MathText text={entry.exampleProblem} />
                        </div>
                        <div className="pt-2 border-t border-[#1a2d46] text-[#a9c2db] font-mono leading-relaxed whitespace-pre-line">
                          <MathText text={entry.exampleSolution} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-2.5 bg-[#142236] border-t border-[#233b5c] flex items-center justify-between text-xs text-[#8aa3bf]">
          <span>Standard SI Units: kg, m/s, N, s</span>
          <button
            onClick={() => {
              retroAudio.playClick();
              onClose();
            }}
            className="retro-btn px-4 py-1 text-xs font-bold"
          >
            Close Formulary
          </button>
        </div>
      </div>
    </div>
  );
};
