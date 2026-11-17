import React from 'react';
import { BookOpen, Activity, Volume2, VolumeX, Globe } from 'lucide-react';
import { retroAudio } from '../utils/retroAudio';

interface HeaderProps {
  activeMode: 'practice' | 'mock_test';
  onSelectMode: (mode: 'practice' | 'mock_test') => void;
  onOpenFormulas: () => void;
  onOpenSandbox: () => void;
  onOpenGithubGuide: () => void;
  audioMuted: boolean;
  onToggleAudio: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeMode,
  onSelectMode,
  onOpenFormulas,
  onOpenSandbox,
  onOpenGithubGuide,
  audioMuted,
  onToggleAudio,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0c1624] border-b-2 border-[#1f3758] shadow-md">
      {/* Top retro simulated title strip */}
      <div className="bg-[#142338] px-4 py-1 text-[11px] text-[#8aa3bf] border-b border-[#1b2f4a] flex items-center justify-between select-none font-mono">
        <div className="flex items-center gap-2">
          <span className="text-[#00e5ff] font-bold">● REC</span>
          <span>PHYSICS 10: IMPULSE &amp; MOMENTUM REVIEW SYSTEM (1995 REV)</span>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <span>PORT: 3000</span>
          <span>MEM: 640KB OK</span>
          <span>VGA 640x480</span>
        </div>
      </div>

      {/* Main Top Bar Contract: 3 zones separated by gap-8 */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Brand title wordmark */}
        <div className="flex items-center gap-2 whitespace-nowrap shrink-0">
          <div className="w-6 h-6 bg-[#008196] border border-[#00e5ff] flex items-center justify-center font-bold text-xs text-white">
            p
          </div>
          <span className="text-base sm:text-lg font-bold tracking-tight text-white font-mono">
            IMPULSE<span className="text-[#00e5ff]">&amp;</span>MOMENTUM
          </span>
        </div>

        {/* Zone 2: Navigation buttons */}
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-0.5">
          <button
            onClick={() => {
              retroAudio.playClick();
              onSelectMode('practice');
            }}
            className={`px-3 py-1.5 text-xs font-bold font-mono transition-colors whitespace-nowrap shrink-0 border ${
              activeMode === 'practice'
                ? 'bg-[#00e5ff] text-[#080e18] border-[#00e5ff] shadow-inner'
                : 'bg-[#152336] text-[#c0d4e8] border-[#233b5c] hover:bg-[#1b2f48] hover:text-white'
            }`}
          >
            Practice Mode
          </button>

          <button
            onClick={() => {
              retroAudio.playClick();
              onSelectMode('mock_test');
            }}
            className={`px-3 py-1.5 text-xs font-bold font-mono transition-colors whitespace-nowrap shrink-0 border ${
              activeMode === 'mock_test'
                ? 'bg-[#00e5ff] text-[#080e18] border-[#00e5ff] shadow-inner'
                : 'bg-[#152336] text-[#c0d4e8] border-[#233b5c] hover:bg-[#1b2f48] hover:text-white'
            }`}
          >
            Mock Test Mode
          </button>

          <button
            onClick={() => {
              retroAudio.playClick();
              onOpenFormulas();
            }}
            className="px-2.5 py-1.5 text-xs font-mono bg-[#111f32] text-[#8aa3bf] hover:text-[#00e5ff] border border-[#233b5c] hover:border-[#00e5ff] flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Formulas</span>
          </button>

          <button
            onClick={() => {
              retroAudio.playClick();
              onOpenSandbox();
            }}
            className="px-2.5 py-1.5 text-xs font-mono bg-[#111f32] text-[#8aa3bf] hover:text-[#00e676] border border-[#233b5c] hover:border-[#00e676] flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors"
          >
            <Activity className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">2D Lab</span>
          </button>

          <button
            onClick={() => {
              retroAudio.playClick();
              onOpenGithubGuide();
            }}
            className="px-2.5 py-1.5 text-xs font-mono bg-[#111f32] text-[#8aa3bf] hover:text-[#ffb703] border border-[#233b5c] hover:border-[#ffb703] flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Deploy</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action or sound toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onToggleAudio}
            title={audioMuted ? 'Unmute 90s PC Sound' : 'Mute Sound'}
            className="p-1.5 retro-btn text-xs font-mono flex items-center gap-1"
          >
            {audioMuted ? (
              <VolumeX className="w-4 h-4 text-[#ff5252]" />
            ) : (
              <Volume2 className="w-4 h-4 text-[#00e5ff]" />
            )}
            <span className="hidden lg:inline text-[10px]">
              {audioMuted ? 'MUTE' : 'AUDIO'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
