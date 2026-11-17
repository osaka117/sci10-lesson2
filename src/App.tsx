/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { PracticeMode } from './components/PracticeMode';
import { MockTestMode } from './components/MockTestMode';
import { FormulaReferenceModal } from './components/FormulaReferenceModal';
import { InteractiveSandboxModal } from './components/InteractiveSandboxModal';
import { GithubPagesGuideModal } from './components/GithubPagesGuideModal';
import { retroAudio } from './utils/retroAudio';
import { BookOpen, Activity, Sparkles, Terminal } from 'lucide-react';

export default function App() {
  const [activeMode, setActiveMode] = useState<'practice' | 'mock_test'>('practice');
  const [formulasOpen, setFormulasOpen] = useState<boolean>(false);
  const [sandboxOpen, setSandboxOpen] = useState<boolean>(false);
  const [githubGuideOpen, setGithubGuideOpen] = useState<boolean>(false);
  const [audioMuted, setAudioMuted] = useState<boolean>(false);
  const [crtEffect, setCrtEffect] = useState<boolean>(false);

  const toggleAudio = () => {
    retroAudio.enabled = audioMuted;
    setAudioMuted(!audioMuted);
    if (audioMuted) {
      retroAudio.playClick();
    }
  };

  return (
    <div className={`min-h-screen bg-[#080e18] text-[#d6e3e2] flex flex-col font-mono relative selection:bg-[#00e5ff] selection:text-[#080e18] ${crtEffect ? 'retro-crt-lines' : ''}`}>
      {/* Top Retro Navigation Header */}
      <Header
        activeMode={activeMode}
        onSelectMode={(mode) => setActiveMode(mode)}
        onOpenFormulas={() => setFormulasOpen(true)}
        onOpenSandbox={() => setSandboxOpen(true)}
        onOpenGithubGuide={() => setGithubGuideOpen(true)}
        audioMuted={audioMuted}
        onToggleAudio={toggleAudio}
      />

      {/* Hero Strip / Welcome Announcement */}
      <div className="bg-[#0b1422] border-b border-[#1b2f48] py-3 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[#00e5ff] font-bold">SYSTEM // READY:</span>
            <span className="text-[#8aa3bf]">
              Grade 10 Physics • Impulse ($J = F\Delta t$) &amp; Momentum ($p = mv$) • SI Standard
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                retroAudio.playClick();
                setFormulasOpen(true);
              }}
              className="px-2.5 py-1 bg-[#142338] hover:bg-[#1b2f4a] text-[#00e5ff] border border-[#233b5c] flex items-center gap-1.5 transition-colors"
            >
              <BookOpen className="w-3 h-3" />
              <span>Quick Formula Sheet</span>
            </button>
            <button
              onClick={() => {
                retroAudio.playClick();
                setSandboxOpen(true);
              }}
              className="px-2.5 py-1 bg-[#142338] hover:bg-[#1b2f4a] text-[#00e676] border border-[#233b5c] flex items-center gap-1.5 transition-colors"
            >
              <Activity className="w-3 h-3" />
              <span>Collision Simulator</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Mode Viewport */}
      <main className="flex-1 pb-12">
        {activeMode === 'practice' ? <PracticeMode /> : <MockTestMode />}
      </main>

      {/* Modals */}
      <FormulaReferenceModal
        isOpen={formulasOpen}
        onClose={() => setFormulasOpen(false)}
      />

      <InteractiveSandboxModal
        isOpen={sandboxOpen}
        onClose={() => setSandboxOpen(false)}
      />

      <GithubPagesGuideModal
        isOpen={githubGuideOpen}
        onClose={() => setGithubGuideOpen(false)}
      />

      {/* Retro 90s Footer */}
      <footer className="bg-[#0a121e] border-t-2 border-[#192c44] py-6 px-4 text-xs text-[#8aa3bf]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-white font-bold">
              <Terminal className="w-4 h-4 text-[#00e5ff]" />
              <span>IMPULSE &amp; MOMENTUM REVIEWER // GRADE 10 CURRICULUM</span>
            </div>
            <p className="text-[11px] text-[#5d738d]">
              Key Formulas: $p = mv$ • $J = F\Delta t$ • $J = \Delta p$ • $m_1 u_1 + m_2 u_2 = m_1 v_1 + m_2 v_2$
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <button
              onClick={() => {
                retroAudio.playClick();
                setCrtEffect(!crtEffect);
              }}
              className={`px-2 py-1 border text-[11px] ${
                crtEffect
                  ? 'bg-[#00e5ff] text-black border-[#00e5ff] font-bold'
                  : 'bg-[#111e31] text-[#8aa3bf] border-[#233b5c]'
              }`}
            >
              CRT Scanlines: {crtEffect ? 'ON' : 'OFF'}
            </button>

            <button
              onClick={() => {
                retroAudio.playClick();
                setGithubGuideOpen(true);
              }}
              className="text-[#00e5ff] hover:underline"
            >
              GitHub Pages Guide
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
