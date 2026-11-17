import React from 'react';
import { X, Globe, Terminal, CheckCircle2, Copy } from 'lucide-react';
import { retroAudio } from '../utils/retroAudio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const GithubPagesGuideModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  if (!isOpen) return null;

  const copyCode = (code: string, index: number) => {
    retroAudio.playClick();
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const steps = [
    {
      title: 'Step 1: Configure Base Path in vite.config.ts',
      desc: 'If deploying to a repository like https://username.github.io/my-repo/, set the base path in vite.config.ts to match your repository name:',
      code: `// vite.config.ts\nexport default defineConfig({\n  base: './', // relative path ensures assets load properly on GitHub Pages\n  // ... rest of config\n});`,
    },
    {
      title: 'Step 2: Build the Production Bundle',
      desc: 'Generate static production assets in the /dist folder:',
      code: `npm run build`,
    },
    {
      title: 'Step 3: Deploy via gh-pages or GitHub Actions',
      desc: 'Option A: Deploy using the official gh-pages package directly from the command line:',
      code: `npm install -D gh-pages\n# Add to scripts in package.json: "deploy": "gh-pages -d dist"\nnpm run deploy`,
    },
    {
      title: 'Step 4: Enable GitHub Pages in Repository Settings',
      desc: 'Navigate to your GitHub repository -> Settings -> Pages. Under "Build and deployment", choose "Deploy from a branch" and select branch "gh-pages" (or /dist), then click Save.',
      code: `Repository URL -> Settings -> Pages -> Source: gh-pages branch / (root)`,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-xs">
      <div 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="gh-window-title"
        className="retro-window w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden text-[#e2eaf2]"
      >
        {/* Titlebar */}
        <div className="flex items-center justify-between px-3 py-2 bg-[#1a2c44] border-b-2 border-[#2b4870] select-none">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#00e5ff]" />
            <span id="gh-window-title" className="text-xs md:text-sm font-bold tracking-wider text-[#00e5ff]">
              DEPLOY_DOCS.TXT // GITHUB PAGES DEPLOYMENT GUIDE
            </span>
          </div>
          <button
            onClick={() => {
              retroAudio.playClick();
              onClose();
            }}
            aria-label="Close guide"
            className="retro-btn px-2 py-0.5 text-xs font-bold text-[#ff5252] hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 bg-[#0b1422] overflow-y-auto space-y-4 flex-1 text-xs md:text-sm">
          <div className="p-3 bg-[#111e31] border border-[#233b5c]">
            <p className="text-[#a9c2db] leading-relaxed">
              This single-page React + Vite reviewer is fully client-side and 100% static. It does not require any backend server or API keys, making it effortlessly hostable on GitHub Pages for free!
            </p>
          </div>

          <div className="space-y-4">
            {steps.map((step, idx) => (
              <div key={idx} className="border border-[#1d314b] bg-[#0e1928] p-3">
                <div className="flex items-center gap-2 text-[#ffb703] font-bold text-xs md:text-sm mb-1">
                  <Terminal className="w-3.5 h-3.5 text-[#00e5ff]" />
                  <span>{step.title}</span>
                </div>
                <p className="text-[#8aa3bf] text-xs mb-2">{step.desc}</p>
                <div className="relative bg-[#05090f] p-2.5 border border-[#1b2c42] font-mono text-[11px] md:text-xs text-[#00e5ff]">
                  <pre className="overflow-x-auto whitespace-pre-wrap">{step.code}</pre>
                  <button
                    onClick={() => copyCode(step.code, idx)}
                    className="absolute right-2 top-2 p-1 text-[#8aa3bf] hover:text-white transition-colors"
                    title="Copy command"
                  >
                    {copiedIndex === idx ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#00e676]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-2.5 bg-[#142236] border-t border-[#233b5c] flex items-center justify-between text-xs text-[#8aa3bf]">
          <span>Compatible with all modern web browsers &amp; mobile devices</span>
          <button
            onClick={() => {
              retroAudio.playClick();
              onClose();
            }}
            className="retro-btn px-4 py-1 text-xs font-bold"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
