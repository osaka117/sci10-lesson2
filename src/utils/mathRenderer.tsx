import React from 'react';
import katex from 'katex';

interface MathProps {
  math: string;
  displayMode?: boolean;
  className?: string;
}

export const MathView: React.FC<MathProps> = ({ math, displayMode = false, className = '' }) => {
  const html = React.useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode,
        throwOnError: false,
        strict: false,
      });
    } catch {
      return math;
    }
  }, [math, displayMode]);

  return (
    <span
      className={`inline-block align-middle font-normal ${displayMode ? 'block my-2 overflow-x-auto text-center' : ''} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

interface MathTextProps {
  text: string;
  className?: string;
}

/**
 * Parses mixed text containing inline ($...$) and block ($$...$$) LaTeX expressions
 * and renders standard text alongside KaTeX rendered formulas.
 */
export const MathText: React.FC<MathTextProps> = ({ text, className = '' }) => {
  const parts = React.useMemo(() => {
    if (!text) return [];

    // Match $$...$$ (block) or $...$ (inline)
    const regex = /(\$\$[\s\S]*?\$\$|\$[^\$]+?\$)/g;
    const tokens: Array<{ type: 'text' | 'inline-math' | 'block-math'; content: string }> = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        tokens.push({
          type: 'text',
          content: text.substring(lastIndex, match.index),
        });
      }

      const raw = match[0];
      if (raw.startsWith('$$') && raw.endsWith('$$')) {
        tokens.push({
          type: 'block-math',
          content: raw.slice(2, -2).trim(),
        });
      } else if (raw.startsWith('$') && raw.endsWith('$')) {
        tokens.push({
          type: 'inline-math',
          content: raw.slice(1, -1).trim(),
        });
      }

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      tokens.push({
        type: 'text',
        content: text.substring(lastIndex),
      });
    }

    return tokens;
  }, [text]);

  return (
    <span className={`leading-relaxed ${className}`}>
      {parts.map((part, index) => {
        if (part.type === 'block-math') {
          return (
            <MathView
              key={index}
              math={part.content}
              displayMode={true}
              className="text-[#00e5ff]"
            />
          );
        }
        if (part.type === 'inline-math') {
          return (
            <MathView
              key={index}
              math={part.content}
              displayMode={false}
              className="text-[#00e5ff] px-0.5"
            />
          );
        }
        return <React.Fragment key={index}>{part.content}</React.Fragment>;
      })}
    </span>
  );
};
