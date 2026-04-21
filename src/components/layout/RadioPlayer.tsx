'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { Play, Pause, Volume2, VolumeX, Radio, ChevronUp, ChevronDown, Mic2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudioPlayer } from '@/lib/AudioPlayerContext';

// ── Resize constraints ──────────────────────────────────────────────────────
const MIN_HEIGHT = 56;   // px — collapsed bar's natural height
const MAX_HEIGHT = 320;  // px
const MIN_WIDTH  = 300;  // minimum player width in px
// ────────────────────────────────────────────────────────────────────────────

interface PlayerSize {
  height: number;      // 0 = auto/natural; >0 = explicit forced height
  marginLeft: number;  // px inset from left edge of viewport
  marginRight: number; // px inset from right edge of viewport
}

function loadSize(): PlayerSize {
  if (typeof window === 'undefined') return { height: 0, marginLeft: 0, marginRight: 0 };
  try {
    const raw = localStorage.getItem('rf_player_size');
    if (raw) return { height: 0, marginLeft: 0, marginRight: 0, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return { height: 0, marginLeft: 0, marginRight: 0 };
}

function saveSize(s: PlayerSize) {
  try { localStorage.setItem('rf_player_size', JSON.stringify(s)); } catch { /* ignore */ }
}

export default function RadioPlayer() {
  const { playing, loading, error, volume, muted, setVolume, setMuted, togglePlay } = useAudioPlayer();
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [size, setSize] = useState<PlayerSize>({ height: 0, marginLeft: 0, marginRight: 0 });
  const [mounted, setMounted] = useState(false);

  // Keep a ref so pointer-move closures always read the latest size
  const sizeRef = useRef(size);
  sizeRef.current = size;

  useEffect(() => {
    setSize(loadSize());
    setMounted(true);
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

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  const applySize = useCallback((updates: Partial<PlayerSize>) => {
    setSize(prev => {
      const next = { ...prev, ...updates };
      saveSize(next);
      return next;
    });
  }, []);

  // ── TOP handle — vertical resize ──────────────────────────────────────────
  const onTopHandlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    const startY = e.clientY;
    // Use whatever the current forced height is, falling back to MIN_HEIGHT
    const startH = sizeRef.current.height || MIN_HEIGHT;

    const onMove = (ev: PointerEvent) => {
      const delta = startY - ev.clientY; // drag up → positive → taller
      let newH = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, startH + delta));
      // Snap back to auto when very close to natural size
      if (newH <= MIN_HEIGHT + 6) newH = 0;
      applySize({ height: newH });
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }, [applySize]);

  // ── LEFT handle — horizontal resize ──────────────────────────────────────
  const onLeftHandlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startML = sizeRef.current.marginLeft;

    const onMove = (ev: PointerEvent) => {
      const delta = ev.clientX - startX; // drag right → bigger left margin
      const maxML = Math.max(0, window.innerWidth - MIN_WIDTH - sizeRef.current.marginRight);
      applySize({ marginLeft: Math.max(0, Math.min(maxML, startML + delta)) });
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }, [applySize]);

  // ── RIGHT handle — horizontal resize ─────────────────────────────────────
  const onRightHandlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startMR = sizeRef.current.marginRight;

    const onMove = (ev: PointerEvent) => {
      const delta = startX - ev.clientX; // drag left → bigger right margin
      const maxMR = Math.max(0, window.innerWidth - MIN_WIDTH - sizeRef.current.marginLeft);
      applySize({ marginRight: Math.max(0, Math.min(maxMR, startMR + delta)) });
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }, [applySize]);

  // Whether the container has a forced height (expanded via drag)
  const isHeightForced = mounted && size.height > 0;
  // Show expanded panel if toggled by button OR if user dragged the player taller
  const showExpandedContent = expanded || isHeightForced;

  const containerStyle: React.CSSProperties = mounted ? {
    left:  size.marginLeft,
    right: size.marginRight,
    ...(size.height > 0 ? { height: size.height } : {}),
  } : {};

  if (pathname.startsWith('/studio')) {
    return null;
  }

  return (
    <div
      className="fixed bottom-0 z-50 radio-player flex flex-col"
      style={containerStyle}
    >
      {/* ── TOP drag handle ──────────────────────────────────────────────── */}
      <div
        className="h-2 w-full flex-shrink-0 cursor-ns-resize group relative select-none"
        onPointerDown={onTopHandlePointerDown}
        style={{ touchAction: 'none' }}
        title="Drag to resize height"
      >
        {/* Subtle indicator pill — visible on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <div className="w-10 h-1 rounded-full bg-white/25" />
        </div>
      </div>

      {/* ── Expanded info panel ───────────────────────────────────────────── */}
      <AnimatePresence>
        {showExpandedContent && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: isHeightForced ? 'auto' : 'auto', opacity: 1, flex: isHeightForced ? '1 1 0%' : '0 0 auto' }}
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

      {/* ── Main player bar ───────────────────────────────────────────────── */}
      <div className="relative bg-[#0a0d14]/95 backdrop-blur-2xl border-t border-white/[0.06] text-white shadow-[0_-4px_24px_rgba(0,0,0,0.4)] flex-shrink-0">
        {/* Thin red accent line */}
        <div className="h-px gradient-bar" />

        {/* LEFT drag handle */}
        <div
          className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize group z-10 select-none"
          onPointerDown={onLeftHandlePointerDown}
          style={{ touchAction: 'none' }}
          title="Drag to resize width"
        >
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            <div className="h-5 w-1 rounded-full bg-white/25" />
          </div>
        </div>

        {/* RIGHT drag handle */}
        <div
          className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize group z-10 select-none"
          onPointerDown={onRightHandlePointerDown}
          style={{ touchAction: 'none' }}
          title="Drag to resize width"
        >
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            <div className="h-5 w-1 rounded-full bg-white/25" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 sm:py-2.5">
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

              {/* Expand / collapse toggle */}
              <button
                onClick={() => setExpanded(!expanded)}
                className="hidden sm:flex p-2 text-slate-600 hover:text-white transition-colors rounded-lg hover:bg-white/[0.06]"
                aria-label={showExpandedContent ? 'Mbylle' : 'Hap'}
              >
                {showExpandedContent ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



