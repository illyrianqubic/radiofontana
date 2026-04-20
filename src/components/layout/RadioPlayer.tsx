'use client';

import { useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Radio, ChevronUp, ChevronDown, Mic2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudioPlayer } from '@/lib/AudioPlayerContext';

export default function RadioPlayer() {
  const { playing, loading, error, volume, muted, setVolume, setMuted, togglePlay } = useAudioPlayer();
  const [expanded, setExpanded] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('sq-AL', { hour: '2-digit', minute: '2-digit' }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 radio-player">
      {/* Expanded panel */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="bg-[#080b12]/98 backdrop-blur-2xl text-white overflow-hidden border-t border-white/[0.06]"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-red-600/15 border border-red-500/20 flex items-center justify-center">
                    <Mic2 className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <p className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-red-400 mb-0.5">Tani në emision</p>
                    <p className="text-white font-extrabold text-base">Mëngjesi me Radio Fontana</p>
                    <p className="text-slate-500 text-sm">me Arjeta Krasniqi · 06:00 – 09:00</p>
                  </div>
                </div>
                {currentTime && (
                  <div className="text-3xl font-mono text-white/20 tabular-nums font-light tracking-widest">
                    {currentTime}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main player bar */}
      <div className="bg-[#0a0d14]/95 backdrop-blur-2xl border-t border-white/[0.06] text-white shadow-[0_-4px_24px_rgba(0,0,0,0.4)]">
        {/* Thin red accent line */}
        <div className="h-px gradient-bar" />

        <div className="max-w-7xl mx-auto px-3 sm:px-5 py-2 sm:py-2.5">
          <div className="flex items-center gap-2.5 sm:gap-4">

            {/* Station branding */}
            <div className="flex items-center gap-2.5 sm:gap-3 flex-1 min-w-0">
              <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${playing ? 'bg-red-600/20 border border-red-500/30' : 'bg-white/[0.05] border border-white/[0.08]'}`}>
                <Radio className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors duration-300 ${playing ? 'text-red-400' : 'text-slate-500'}`} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-xs sm:text-sm font-bold text-white leading-tight truncate">Radio Fontana</p>
                  <span className="hidden sm:block text-[10px] text-slate-600">98.8 FM</span>
                </div>
                <p className="text-[9px] sm:text-[10px] text-slate-500 truncate">
                  {error
                    ? 'Transmetimi nuk është i disponueshëm'
                    : playing
                    ? 'Duke transmetuar live · Pejë, Kosovë'
                    : 'Klikoni play për të dëgjuar'}
                </p>
              </div>
            </div>

            {/* Waveform (when playing) */}
            {playing && (
              <div className="hidden sm:flex items-center gap-0.5 h-5 flex-shrink-0">
                {[1, 2, 3, 4, 5].map((n) => (
                  <div
                    key={n}
                    className="waveform-bar w-0.5 rounded-full bg-red-500 opacity-80"
                    style={{ height: '6px' }}
                  />
                ))}
              </div>
            )}

            {/* Controls */}
            <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
              {/* Volume */}
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => setMuted(!muted)}
                  className="text-slate-500 hover:text-white transition-colors p-1"
                  aria-label={muted ? 'Aktivizo tingullin' : 'Hiqe tingullin'}
                >
                  {muted || volume === 0 ? (
                    <VolumeX className="w-3.5 h-3.5" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={muted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20"
                  aria-label="Volumi"
                />
              </div>

              {/* Live badge */}
              {playing && (
                <span className="hidden sm:flex items-center gap-1 bg-red-600/15 border border-red-500/25 text-red-400 px-2.5 py-1 rounded-full text-[9px] font-extrabold tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  LIVE
                </span>
              )}

              {/* Play / Pause */}
              <button
                onClick={togglePlay}
                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95 shadow-lg ${
                  error
                    ? 'bg-slate-700 hover:bg-slate-600 text-slate-300 shadow-black/30'
                    : playing
                    ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-900/40'
                    : 'bg-white hover:bg-slate-100 text-slate-900 shadow-black/20'
                }`}
                aria-label={playing ? 'Ndalo' : error ? 'Provo përsëri' : 'Luaj'}
              >
                {loading ? (
                  <div className={`w-4 h-4 border-2 rounded-full animate-spin ${playing ? 'border-white border-t-transparent' : 'border-slate-900 border-t-transparent'}`} />
                ) : error ? (
                  <Play className="w-4 h-4 ml-0.5 opacity-60" />
                ) : playing ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4 ml-0.5" />
                )}
              </button>

              {/* Expand */}
              <button
                onClick={() => setExpanded(!expanded)}
                className="hidden sm:flex p-2 text-slate-600 hover:text-white transition-colors rounded-lg hover:bg-white/[0.06]"
                aria-label={expanded ? 'Mbylle' : 'Hap'}
              >
                {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


