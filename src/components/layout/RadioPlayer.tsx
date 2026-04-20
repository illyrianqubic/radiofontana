'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Radio, ChevronUp, ChevronDown, Mic2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STREAM_URL = 'https://stream.radiofontana.com/live';

export default function RadioPlayer() {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'none';
    audio.volume = volume;
    audioRef.current = audio;

    audio.addEventListener('waiting', () => setLoading(true));
    audio.addEventListener('playing', () => { setLoading(false); setPlaying(true); });
    audio.addEventListener('pause', () => setPlaying(false));
    audio.addEventListener('error', () => { setLoading(false); setPlaying(false); });

    return () => { audio.pause(); audio.src = ''; };
  }, []);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('sq-AL', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume;
    }
  }, [volume, muted]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      audio.src = '';
    } else {
      setLoading(true);
      audio.src = STREAM_URL;
      audio.play().catch(() => {
        setLoading(false);
        setPlaying(false);
      });
    }
  }, [playing]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    setMuted(v === 0);
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
            className="bg-slate-950/95 backdrop-blur-xl text-white overflow-hidden border-t border-white/5"
          >
            <div className="max-w-7xl mx-auto px-6 py-5">
              <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#e63946]/10 flex items-center justify-center">
                    <Mic2 className="w-5 h-5 text-[#e63946]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#e63946] mb-0.5">Tani në emision</p>
                    <p className="text-white font-bold text-lg">Mëngjesi me Radio Fontana</p>
                    <p className="text-slate-400 text-sm">me Arjeta Krasniqi · 06:00 - 09:00</p>
                  </div>
                </div>
                <div className="text-4xl font-mono text-white/30 tabular-nums font-light tracking-wider">{currentTime}</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main player bar */}
      <div className="bg-slate-950/90 backdrop-blur-2xl border-t border-white/[0.06] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Station info */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${playing ? 'bg-[#e63946]/15' : 'bg-white/5'}`}>
                <Radio className={`w-4 h-4 transition-colors duration-300 ${playing ? 'text-[#e63946]' : 'text-slate-400'}`} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white leading-tight truncate">Radio Fontana</p>
                <p className="text-[11px] text-slate-500 truncate">
                  {playing ? 'Duke transmetuar live...' : '96.5 FM · Pejë, Kosovë'}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                disabled={loading}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95 disabled:opacity-50 ${
                  playing
                    ? 'bg-[#e63946] hover:bg-[#d32f3f] text-white shadow-lg shadow-[#e63946]/25'
                    : 'bg-white hover:bg-slate-100 text-slate-900'
                }`}
                aria-label={playing ? 'Ndalo' : 'Luaj'}
              >
                {loading ? (
                  <div className={`w-4 h-4 border-2 rounded-full animate-spin ${playing ? 'border-white border-t-transparent' : 'border-slate-900 border-t-transparent'}`} />
                ) : playing ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4 ml-0.5" />
                )}
              </button>

              {/* Volume — hidden on mobile */}
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => setMuted(!muted)}
                  className="text-slate-500 hover:text-white transition-colors"
                  aria-label={muted ? 'Aktivizo tingullin' : 'Hiqe tingullin'}
                >
                  {muted || volume === 0 ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
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
                <span className="hidden sm:flex items-center gap-1.5 bg-[#e63946] px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  LIVE
                </span>
              )}
            </div>

            {/* Expand toggle */}
            <button
              onClick={() => setExpanded(!expanded)}
              className="hidden sm:flex p-2 text-slate-500 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              aria-label={expanded ? 'Mbylle' : 'Hap'}
            >
              {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
