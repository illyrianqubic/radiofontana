'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Radio, ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STREAM_URL = 'https://stream.radiofontana.com/live'; // mock stream URL

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
      setCurrentTime(now.toLocaleTimeString('sq-AL', { hour: '2-digit', minute: '2-digit' }));
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
            className="bg-[#0f2347]/95 text-white overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 py-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                  <p className="text-sm text-blue-300 font-medium mb-1">Tani në emision</p>
                  <p className="text-white font-bold text-lg">Mëngjesi me Radio Fontana</p>
                  <p className="text-blue-200 text-sm">me Arjeta Krasniqi · 06:00 - 09:00</p>
                </div>
                <div className="text-4xl font-mono text-blue-200 tabular-nums">{currentTime}</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main player bar */}
      <div className="bg-[#1a3a6b]/95 backdrop-blur-md border-t border-blue-800 text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Station info */}
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <div className="w-9 h-9 rounded-full bg-[#0f2347] border-2 border-blue-500 flex items-center justify-center flex-shrink-0">
                <Radio className="w-4 h-4 text-blue-300" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white leading-tight truncate">Radio Fontana</p>
                <p className="text-xs text-blue-300 truncate">
                  {playing
                    ? 'Duke transmetuar live...'
                    : '96.5 FM · Pejë, Kosovë'}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                disabled={loading}
                className="w-11 h-11 rounded-full bg-white text-[#1a3a6b] hover:bg-blue-50 transition-all flex items-center justify-center shadow-md hover:shadow-lg disabled:opacity-60 active:scale-95"
                aria-label={playing ? 'Ndalo' : 'Luaj'}
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-[#1a3a6b] border-t-transparent rounded-full animate-spin" />
                ) : playing ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5 ml-0.5" />
                )}
              </button>

              {/* Volume — hidden on mobile */}
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => setMuted(!muted)}
                  className="text-blue-300 hover:text-white transition-colors"
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
                  className="w-24 h-1.5 accent-white cursor-pointer"
                  aria-label="Volumi"
                />
              </div>

              {/* Live badge */}
              {playing && (
                <span className="hidden sm:flex items-center gap-1.5 bg-red-600 px-2.5 py-1 rounded-full text-xs font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  LIVE
                </span>
              )}
            </div>

            {/* Expand toggle */}
            <button
              onClick={() => setExpanded(!expanded)}
              className="hidden sm:flex p-1.5 text-blue-300 hover:text-white transition-colors ml-auto"
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
