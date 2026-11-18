import React from 'react';
import { Question } from '../types/physics';
import { MathText } from '../utils/mathRenderer';

interface GufsaSolutionPanelProps {
  question: Question;
}

export const GufsaSolutionPanel: React.FC<GufsaSolutionPanelProps> = ({ question }) => {
  const { gufsa, formulaReason, takeaway } = question;

  const rows: Array<{
    letter: 'G' | 'U' | 'F' | 'S' | 'A';
    title: string;
    accentColor: string;
    content: React.ReactNode;
  }> = [
    {
      letter: 'G',
      title: 'GIVEN',
      accentColor: '#00e5ff',
      content: (
        <ul className="space-y-1">
          {gufsa.given.map((item, idx) => (
            <li key={idx} className="text-[#e2eaf2]">
              <MathText text={item} />
            </li>
          ))}
        </ul>
      ),
    },
    {
      letter: 'U',
      title: 'UNKNOWN',
      accentColor: '#ffb703',
      content: (
        <div className="text-[#e2eaf2]">
          <MathText text={gufsa.unknown} />
        </div>
      ),
    },
    {
      letter: 'F',
      title: 'FORMULA',
      accentColor: '#00e5ff',
      content: (
        <div className="space-y-1">
          <div className="text-sm md:text-base font-bold text-[#00e5ff]">
            <MathText text={gufsa.formula} />
          </div>
          <p className="text-xs text-[#a9c2db] font-sans">
            <MathText text={formulaReason} />
          </p>
        </div>
      ),
    },
    {
      letter: 'S',
      title: 'SOLUTION',
      accentColor: '#c0d4e8',
      content: (
        <div className="space-y-1.5">
          {gufsa.solution.map((step, idx) => (
            <div key={idx} className="text-[#e2eaf2]">
              <MathText text={step} />
            </div>
          ))}
        </div>
      ),
    },
    {
      letter: 'A',
      title: 'ANSWER',
      accentColor: '#00e676',
      content: (
        <div className="font-bold text-[#00e676] text-sm md:text-base">
          <MathText text={gufsa.answer} />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <span className="text-[#ffb703] font-bold uppercase tracking-wider">
          GUFSA METHOD SOLUTION
        </span>
        <span className="text-[#8aa3bf]">
          Given · Unknown · Formula · Solution · Answer
        </span>
      </div>

      <div className="space-y-2">
        {rows.map((row) => (
          <div
            key={row.letter}
            className="p-3 bg-[#111e31] border border-[#1d3350] flex items-start gap-3 text-xs md:text-sm font-mono"
          >
            <div
              className="w-7 h-7 shrink-0 flex items-center justify-center font-bold text-xs border-2 bg-[#080e18]"
              style={{ borderColor: row.accentColor, color: row.accentColor }}
              aria-hidden="true"
            >
              {row.letter}
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <span
                className="text-[11px] font-bold tracking-wider uppercase block"
                style={{ color: row.accentColor }}
              >
                {row.title}
              </span>
              {row.content}
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 bg-[#142338] border border-[#2c4c78] text-xs md:text-sm font-mono">
        <span className="text-[#ffb703] font-bold block mb-1">
          KEY GRADE 10 TAKEAWAY:
        </span>
        <div className="text-[#c8d9ea] font-sans">
          <MathText text={takeaway} />
        </div>
      </div>
    </div>
  );
};
