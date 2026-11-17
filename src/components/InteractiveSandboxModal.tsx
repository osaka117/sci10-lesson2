import React, { useState, useEffect, useRef } from 'react';
import { X, Play, RotateCcw, Activity } from 'lucide-react';
import { MathView } from '../utils/mathRenderer';
import { retroAudio } from '../utils/retroAudio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const InteractiveSandboxModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'collision' | 'impulse'>('collision');

  // Collision state
  const [m1, setM1] = useState<number>(3); // kg
  const [u1, setU1] = useState<number>(5); // m/s
  const [m2, setM2] = useState<number>(2); // kg
  const [u2, setU2] = useState<number>(-2); // m/s
  const [inelastic, setInelastic] = useState<boolean>(true); // stick together

  // Simulation physics state
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [pos1, setPos1] = useState<number>(100);
  const [pos2, setPos2] = useState<number>(450);
  const [curV1, setCurV1] = useState<number>(5);
  const [curV2, setCurV2] = useState<number>(-2);
  const [collided, setCollided] = useState<boolean>(false);

  // Impulse state
  const [impMass, setImpMass] = useState<number>(2); // kg
  const [impForce, setImpForce] = useState<number>(20); // N
  const [impTime, setImpTime] = useState<number>(0.5); // s
  const [impPos, setImpPos] = useState<number>(50);
  const [impVel, setImpVel] = useState<number>(0);
  const [impTimeElapsed, setImpTimeElapsed] = useState<number>(0);

  const animRef = useRef<number | null>(null);

  // Reset collision
  const resetCollision = () => {
    setIsRunning(false);
    setPos1(100);
    setPos2(450);
    setCurV1(u1);
    setCurV2(u2);
    setCollided(false);
  };

  // Reset impulse
  const resetImpulse = () => {
    setIsRunning(false);
    setImpPos(50);
    setImpVel(0);
    setImpTimeElapsed(0);
  };

  useEffect(() => {
    if (activeTab === 'collision') {
      resetCollision();
    } else {
      resetImpulse();
    }
  }, [m1, u1, m2, u2, inelastic, impMass, impForce, impTime, activeTab]);

  // Main animation loop
  useEffect(() => {
    if (!isRunning) {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      return;
    }

    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05); // seconds
      lastTime = now;

      if (activeTab === 'collision') {
        setPos1((prev1) => {
          setPos2((prev2) => {
            const width = 60; // cart visual width
            let newPos1 = prev1 + curV1 * 50 * dt;
            let newPos2 = prev2 + curV2 * 50 * dt;

            // Check collision
            if (!collided && newPos1 + width >= newPos2) {
              setCollided(true);
              retroAudio.playClick();
              if (inelastic) {
                // Stick together
                const commonV = (m1 * curV1 + m2 * curV2) / (m1 + m2);
                setCurV1(commonV);
                setCurV2(commonV);
              } else {
                // 1D elastic collision
                const newV1 = ((m1 - m2) * curV1 + 2 * m2 * curV2) / (m1 + m2);
                const newV2 = ((m2 - m1) * curV2 + 2 * m1 * curV1) / (m1 + m2);
                setCurV1(newV1);
                setCurV2(newV2);
              }
            }

            // Boundary checks
            if (newPos1 < 20) {
              newPos1 = 20;
              setCurV1(0);
            }
            if (newPos2 > 560) {
              newPos2 = 560;
              setCurV2(0);
            }

            return newPos2;
          });
          return prev1 + curV1 * 50 * dt;
        });
      } else {
        // Impulse Tab
        setImpTimeElapsed((t) => {
          const newT = t + dt;
          if (t < impTime) {
            // Force is actively accelerating cart
            const accel = impForce / impMass;
            const newVel = impVel + accel * dt;
            setImpVel(newVel);
            setImpPos((p) => Math.min(p + newVel * 40 * dt, 560));
          } else {
            // Force ended, cart coasts at constant final velocity
            setImpPos((p) => Math.min(p + impVel * 40 * dt, 560));
          }
          return newT;
        });
      }

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isRunning, activeTab, curV1, curV2, collided, inelastic, m1, m2, impForce, impMass, impTime, impVel]);

  if (!isOpen) return null;

  // Collision calculations
  const p1 = m1 * curV1;
  const p2 = m2 * curV2;
  const pTotal = p1 + p2;

  // Impulse calculations
  const theoreticalJ = impForce * impTime;
  const theoreticalVf = theoreticalJ / impMass;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-xs">
      <div 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="sim-window-title"
        className="retro-window w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden text-[#e2eaf2]"
      >
        {/* Titlebar */}
        <div className="flex items-center justify-between px-3 py-2 bg-[#1a2c44] border-b-2 border-[#2b4870] select-none">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#00e676]" />
            <span id="sim-window-title" className="text-xs md:text-sm font-bold tracking-wider text-[#00e676]">
              COLLISION_LAB.EXE // RETRO PHYSICS SIMULATOR
            </span>
          </div>
          <button
            onClick={() => {
              retroAudio.playClick();
              onClose();
            }}
            aria-label="Close simulator"
            className="retro-btn px-2 py-0.5 text-xs font-bold text-[#ff5252] hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="p-2.5 bg-[#0f1b2c] border-b border-[#233b5c] flex items-center gap-2">
          <button
            onClick={() => {
              retroAudio.playClick();
              setActiveTab('collision');
            }}
            className={`px-3 py-1 text-xs border ${
              activeTab === 'collision'
                ? 'bg-[#00e5ff] text-[#080e18] font-bold border-[#00e5ff]'
                : 'bg-[#152336] text-[#8aa3bf] border-[#233b5c] hover:text-white'
            }`}
          >
            Two-Cart Collision Sandbox
          </button>
          <button
            onClick={() => {
              retroAudio.playClick();
              setActiveTab('impulse');
            }}
            className={`px-3 py-1 text-xs border ${
              activeTab === 'impulse'
                ? 'bg-[#00e5ff] text-[#080e18] font-bold border-[#00e5ff]'
                : 'bg-[#152336] text-[#8aa3bf] border-[#233b5c] hover:text-white'
            }`}
          >
            Impulse &amp; Force Duration Lab
          </button>
        </div>

        {/* Simulator Screen */}
        <div className="p-4 bg-[#0b1422] overflow-y-auto space-y-4 flex-1">
          {/* Visual Track Area */}
          <div className="retro-window-inner p-3 relative h-48 sm:h-56 flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between text-[11px] text-[#5d738d] font-mono select-none">
              <span>TRACK RULER: 0.0 m</span>
              <span>1D ISOLATED SYSTEM (FRICTIONLESS)</span>
              <span>10.0 m</span>
            </div>

            {/* Track Line & Carts */}
            <div className="relative w-full h-24 my-auto border-b-2 border-[#2b4870]">
              {activeTab === 'collision' ? (
                <>
                  {/* Cart 1 */}
                  <div
                    className="absolute bottom-0 w-16 h-12 bg-[#008196] border-2 border-[#00e5ff] flex flex-col items-center justify-center text-[10px] font-bold shadow-md transition-all duration-75"
                    style={{ left: `${Math.max(10, Math.min(pos1, 520))}px` }}
                  >
                    <span className="text-[#080e18] bg-[#00e5ff] px-1 rounded-xs">
                      CART 1
                    </span>
                    <span className="text-white mt-0.5">{m1} kg</span>
                    <div className="absolute -bottom-2 flex justify-between w-full px-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-600"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-600"></div>
                    </div>
                  </div>

                  {/* Cart 2 */}
                  <div
                    className="absolute bottom-0 w-16 h-12 bg-[#b35900] border-2 border-[#ffb703] flex flex-col items-center justify-center text-[10px] font-bold shadow-md transition-all duration-75"
                    style={{ left: `${Math.max(10, Math.min(pos2, 520))}px` }}
                  >
                    <span className="text-[#080e18] bg-[#ffb703] px-1 rounded-xs">
                      CART 2
                    </span>
                    <span className="text-white mt-0.5">{m2} kg</span>
                    <div className="absolute -bottom-2 flex justify-between w-full px-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-600"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-600"></div>
                    </div>
                  </div>
                </>
              ) : (
                /* Impulse Tab Cart */
                <div
                  className="absolute bottom-0 w-20 h-12 bg-[#1b5e20] border-2 border-[#00e676] flex flex-col items-center justify-center text-[10px] font-bold shadow-md transition-all duration-75"
                  style={{ left: `${Math.max(10, Math.min(impPos, 520))}px` }}
                >
                  <span className="text-[#080e18] bg-[#00e676] px-1 rounded-xs">
                    OBJECT
                  </span>
                  <span className="text-white mt-0.5">{impMass} kg</span>
                  {impTimeElapsed < impTime && isRunning && (
                    <div className="absolute -left-7 top-2 text-[#ff5252] font-black text-sm animate-pulse">
                      ➔ {impForce}N
                    </div>
                  )}
                  <div className="absolute -bottom-2 flex justify-between w-full px-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-600"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-600"></div>
                  </div>
                </div>
              )}
            </div>

            {/* Live readout strip */}
            <div className="bg-[#080e18] p-2 border border-[#1b2f48] text-xs font-mono flex flex-wrap items-center justify-between gap-2">
              {activeTab === 'collision' ? (
                <>
                  <div>
                    <span className="text-[#8aa3bf]">p₁: </span>
                    <span className="text-[#00e5ff] font-bold">
                      {(m1 * curV1).toFixed(1)} kg·m/s
                    </span>
                  </div>
                  <div>
                    <span className="text-[#8aa3bf]">p₂: </span>
                    <span className="text-[#ffb703] font-bold">
                      {(m2 * curV2).toFixed(1)} kg·m/s
                    </span>
                  </div>
                  <div className="border-l border-[#233b5c] pl-2">
                    <span className="text-[#8aa3bf]">TOTAL MOMENTUM (p_tot): </span>
                    <span className="text-[#00e676] font-bold">
                      {pTotal.toFixed(1)} kg·m/s
                    </span>
                  </div>
                  <div>
                    <span className="text-[#8aa3bf]">STATUS: </span>
                    <span className={collided ? 'text-[#ff5252] font-bold' : 'text-[#8aa3bf]'}>
                      {collided ? 'IMPACTED' : 'IN APPROACH'}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <span className="text-[#8aa3bf]">IMPULSE (J = FΔt): </span>
                    <span className="text-[#00e676] font-bold">{theoreticalJ.toFixed(1)} N·s</span>
                  </div>
                  <div>
                    <span className="text-[#8aa3bf]">CURRENT SPEED (v): </span>
                    <span className="text-[#00e5ff] font-bold">{impVel.toFixed(2)} m/s</span>
                  </div>
                  <div>
                    <span className="text-[#8aa3bf]">THEORETICAL FINAL (v_f): </span>
                    <span className="text-[#ffb703] font-bold">{theoreticalVf.toFixed(2)} m/s</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Interactive Parameter Controls */}
          {activeTab === 'collision' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Cart 1 Controls */}
              <div className="p-3 bg-[#111e31] border border-[#233b5c] space-y-2 text-xs">
                <span className="font-bold text-[#00e5ff] block uppercase tracking-wider">
                  Cart 1 Parameters (Cyan)
                </span>
                <div className="flex items-center justify-between">
                  <label htmlFor="cart1-mass" className="text-[#8aa3bf]">Mass (m₁):</label>
                  <input
                    id="cart1-mass"
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={m1}
                    onChange={(e) => setM1(Number(e.target.value))}
                    className="w-32 accent-[#00e5ff]"
                  />
                  <span className="w-12 font-mono text-right text-white">{m1} kg</span>
                </div>
                <div className="flex items-center justify-between">
                  <label htmlFor="cart1-velocity" className="text-[#8aa3bf]">Velocity (u₁):</label>
                  <input
                    id="cart1-velocity"
                    type="range"
                    min="-8"
                    max="8"
                    step="1"
                    value={u1}
                    onChange={(e) => setU1(Number(e.target.value))}
                    className="w-32 accent-[#00e5ff]"
                  />
                  <span className="w-12 font-mono text-right text-white">{u1} m/s</span>
                </div>
              </div>

              {/* Cart 2 Controls */}
              <div className="p-3 bg-[#111e31] border border-[#233b5c] space-y-2 text-xs">
                <span className="font-bold text-[#ffb703] block uppercase tracking-wider">
                  Cart 2 Parameters (Amber)
                </span>
                <div className="flex items-center justify-between">
                  <label htmlFor="cart2-mass" className="text-[#8aa3bf]">Mass (m₂):</label>
                  <input
                    id="cart2-mass"
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={m2}
                    onChange={(e) => setM2(Number(e.target.value))}
                    className="w-32 accent-[#ffb703]"
                  />
                  <span className="w-12 font-mono text-right text-white">{m2} kg</span>
                </div>
                <div className="flex items-center justify-between">
                  <label htmlFor="cart2-velocity" className="text-[#8aa3bf]">Velocity (u₂):</label>
                  <input
                    id="cart2-velocity"
                    type="range"
                    min="-8"
                    max="8"
                    step="1"
                    value={u2}
                    onChange={(e) => setU2(Number(e.target.value))}
                    className="w-32 accent-[#ffb703]"
                  />
                  <span className="w-12 font-mono text-right text-white">{u2} m/s</span>
                </div>
              </div>

              {/* Collision Type Selection */}
              <div className="md:col-span-2 p-3 bg-[#111e31] border border-[#233b5c] flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-4">
                  <span className="text-[#8aa3bf] font-bold">Collision Type:</span>
                  <label className="flex items-center gap-1.5 cursor-pointer text-white">
                    <input
                      type="radio"
                      name="col-type"
                      checked={inelastic}
                      onChange={() => setInelastic(true)}
                      className="accent-[#00e5ff]"
                    />
                    <span>Stick Together (Inelastic)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-white">
                    <input
                      type="radio"
                      name="col-type"
                      checked={!inelastic}
                      onChange={() => setInelastic(false)}
                      className="accent-[#00e5ff]"
                    />
                    <span>Bounce Off (Elastic)</span>
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      retroAudio.playClick();
                      setIsRunning(!isRunning);
                    }}
                    className="retro-btn-primary px-4 py-1.5 text-xs font-bold flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>{isRunning ? 'Pause' : 'Start Simulation'}</span>
                  </button>
                  <button
                    onClick={() => {
                      retroAudio.playClick();
                      resetCollision();
                    }}
                    className="retro-btn px-3 py-1.5 text-xs font-bold flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Impulse Controls */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 bg-[#111e31] border border-[#233b5c] space-y-1.5 text-xs">
                <label htmlFor="imp-mass" className="text-[#8aa3bf] block">Cart Mass (m):</label>
                <input
                  id="imp-mass"
                  type="range"
                  min="1"
                  max="5"
                  step="0.5"
                  value={impMass}
                  onChange={(e) => setImpMass(Number(e.target.value))}
                  className="w-full accent-[#00e676]"
                />
                <span className="font-mono text-white block text-right">{impMass} kg</span>
              </div>

              <div className="p-3 bg-[#111e31] border border-[#233b5c] space-y-1.5 text-xs">
                <label htmlFor="imp-force" className="text-[#8aa3bf] block">Applied Force (F):</label>
                <input
                  id="imp-force"
                  type="range"
                  min="5"
                  max="50"
                  step="5"
                  value={impForce}
                  onChange={(e) => setImpForce(Number(e.target.value))}
                  className="w-full accent-[#00e676]"
                />
                <span className="font-mono text-white block text-right">{impForce} N</span>
              </div>

              <div className="p-3 bg-[#111e31] border border-[#233b5c] space-y-1.5 text-xs">
                <label htmlFor="imp-duration" className="text-[#8aa3bf] block">Duration (Δt):</label>
                <input
                  id="imp-duration"
                  type="range"
                  min="0.1"
                  max="1.5"
                  step="0.1"
                  value={impTime}
                  onChange={(e) => setImpTime(Number(e.target.value))}
                  className="w-full accent-[#00e676]"
                />
                <span className="font-mono text-white block text-right">{impTime} s</span>
              </div>

              <div className="md:col-span-3 p-3 bg-[#111e31] border border-[#233b5c] flex items-center justify-between text-xs">
                <div className="text-[#8aa3bf]">
                  Formula in Action:{' '}
                  <span className="text-[#00e676] font-bold">
                    <MathView math="J = F\Delta t = m(v_f - v_i) \implies v_f = \frac{F\Delta t}{m}" />
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      retroAudio.playClick();
                      setIsRunning(!isRunning);
                    }}
                    className="retro-btn-primary px-4 py-1.5 text-xs font-bold flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>{isRunning ? 'Pause' : 'Apply Force'}</span>
                  </button>
                  <button
                    onClick={() => {
                      retroAudio.playClick();
                      resetImpulse();
                    }}
                    className="retro-btn px-3 py-1.5 text-xs font-bold flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-2.5 bg-[#142236] border-t border-[#233b5c] flex items-center justify-between text-xs text-[#8aa3bf]">
          <span>Notice: In all collisions, total momentum is conserved!</span>
          <button
            onClick={() => {
              retroAudio.playClick();
              onClose();
            }}
            className="retro-btn px-4 py-1 text-xs font-bold"
          >
            Close Simulator
          </button>
        </div>
      </div>
    </div>
  );
};
