'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { Play, Pause, Volume2, VolumeX, Radio, ChevronUp, ChevronDown, Mic2, GripHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudioPlayer } from '@/lib/AudioPlayerContext';

// ── Constraints ──────────────────────────────────────────────────────────────
const MIN_W = 300;
const MAX_W = 960;
const MIN_H = 76;   // drag-handle(20) + gradient-line(1) + controls(~55)
const MAX_H = 440;
const STORAGE_KEY = 'rf_player_v2';
// ─────────────────────────────────────────────────────────────────────────────

interface PS { x: number; y: number; width: number; height: number }

function clampPS(s: PS): PS {
  const width  = Math.max(MIN_W, Math.min(MAX_W, s.width));
  const height = Math.max(MIN_H, Math.min(MAX_H, s.height));
  if (typeof window === 'undefined') return { ...s, width, height };
  const x = Math.max(0, Math.min(window.innerWidth  - width,  s.x));
  const y = Math.max(0, Math.min(window.innerHeight - height, s.y));
  return { x, y, width, height };
}

function defaultPS(): PS {
  const width = 460;
  return {
    x: Math.max(0, Math.round((window.innerWidth - width) / 2)),
    y: Math.max(0, window.innerHeight - MIN_H - 10),
    width,
    height: MIN_H,
  };
}

function loadPS(): PS | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return clampPS(JSON.parse(raw) as PS);
  } catch { /* ignore */ }
  return null;
}

function savePS(s: PS) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch { /* ignore */ }
}

export default function RadioPlayer() {
  const { playing, loading, error, volume, muted, setVolume, setMuted, togglePlay } = useAudioPlayer();
  const pathname = usePathname();
  const [currentTime, setCurrentTime] = useState('');
  const [ps, setPs] = useState<PS>({ x: 0, y: 0, width: 460, height: MIN_H });
  const [mounted, setMounted] = useState(false);
  const psRef = useRef<PS>(ps);
  psRef.current = ps;

  // Hydrate from localStorage once mounted
  useEffect(() => {
    const initial = loadPS() ?? defaultPS();
    setPs(initial);
    setMounted(true);
  }, []);

  // Persist on every change (after mount)
  useEffect(() => {
    if (mounted) savePS(ps);
  }, [ps, mounted]);

  // Clock
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

  // Toggle expanded info panel (also snaps height)
  const toggleExpand = useCallback(() => {
    setPs(prev => {
      const isExpanded = prev.height > MIN_H + 20;
      return clampPS({ ...prev, height: isExpanded ? MIN_H : 220 });
    });
  }, []);

  // ── Drag to move ─────────────────────────────────────────────────────────
  const onDragDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button, input')) return;
    e.preventDefault();
    const originX = e.clientX - psRef.current.x;
    const originY = e.clientY - psRef.current.y;
    const onMove = (ev: PointerEvent) => {
      setPs(prev => clampPS({ ...prev, x: ev.clientX - originX, y: ev.clientY - originY }));
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }, []);

  // ── Resize via edge / corner handles ─────────────────────────────────────
  const onEdgeDown = useCallback(
    (edges: { t?: 1; b?: 1; l?: 1; r?: 1 }) =>
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      const { x, y, width, height } = psRef.current;
      const sx = e.clientX, sy = e.clientY;
      const onMove = (ev: PointerEvent) => {
        const dx = ev.clientX - sx;
        const dy = ev.clientY - sy;
        let nx = x, ny = y, nw = width, nh = height;
        if (edges.r) nw = width + dx;
        if (edges.l) { nw = width - dx; nx = x + dx; }
        if (edges.b) nh = height + dy;
        if (edges.t) { nh = height - dy; ny = y + dy; }
        // Pin opposite edge when minimum is hit
        if (edges.l && nw < MIN_W) { nw = MIN_W; nx = x + width - MIN_W; }
        if (edges.t && nh < MIN_H) { nh = MIN_H; ny = y + height - MIN_H; }
        setPs(clampPS({ x: nx, y: ny, width: nw, height: nh }));
      };
      const onUp = () => {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
      };
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
    },
    []
  );

  const showExpanded = ps.height > MIN_H + 20;

  if (pathname.startsWith('/studio')) return null;
  if (!mounted) return null;

  return (
    <div
      className="fixed z-50 select-none"
      style={{ left: ps.x, top: ps.y, width: ps.width, height: ps.height }}
    >
      {/* ── Edge resize handles (invisible, sit over panel edges) ─────────── */}
      {/* Top */}
      <div className="absolute top-0 left-3 right-3 h-1.5 z-20 cursor-ns-resize" onPointerDown={onEdgeDown({ t: 1 })} style={{ touchAction: 'none' }} />
      {/* Bottom */}
      <div className="absolute bottom-0 left-3 right-3 h-1.5 z-20 cursor-ns-resize" onPointerDown={onEdgeDown({ b: 1 })} style={{ touchAction: 'none' }} />
      {/* Left */}
      <div className="absolute left-0 top-3 bottom-3 w-1.5 z-20 cursor-ew-resize" onPointerDown={onEdgeDown({ l: 1 })} style={{ touchAction: 'none' }} />
      {/* Right */}
      <div className="absolute right-0 top-3 bottom-3 w-1.5 z-20 cursor-ew-resize" onPointerDown={onEdgeDown({ r: 1 })} style={{ touchAction: 'none' }} />
      {/* Corners */}
      <div className="absolute top-0 left-0 w-3 h-3 z-30 cursor-nwse-resize" onPointerDown={onEdgeDown({ t: 1, l: 1 })} style={{ touchAction: 'none' }} />
      <div className="absolute top-0 right-0 w-3 h-3 z-30 cursor-nesw-resize" onPointerDown={onEdgeDown({ t: 1, r: 1 })} style={{ touchAction: 'none' }} />
      <div className="absolute bottom-0 left-0 w-3 h-3 z-30 cursor-nesw-resize" onPointerDown={onEdgeDown({ b: 1, l: 1 })} style={{ touchAction: 'none' }} />
      <div className="absolute bottom-0 right-0 w-3 h-3 z-30 cursor-nwse-resize" onPointerDown={onEdgeDown({ b: 1, r: 1 })} style={{ touchAction: 'none' }} />

      {/* ── Main panel ───────────────────────────────────────────────────── */}
      <div className="absolute inset-0 bg-black rounded-xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.7),0_2px_12px_rgba(0,0,0,0.5)] border border-white/[0.09] flex flex-col radio-player">

        {/* ── Drag handle bar ──────────────────────────────────────────── */}
        <div
          className="flex-shrink-0 h-5 flex items-center justify-center cursor-grab active:cursor-grabbing border-b border-white/[0.05] group"
          onPointerDown={onDragDown}
          style={{ touchAction: 'none' }}
          title="Drag to move"
        >
          <GripHorizontal className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors duration-150" />
        </div>

        {/* Red gradient accent line */}
        <div className="h-px flex-shrink-0 gradient-bar" />

        {/* ── Expanded info panel ───────────────────────────────────────── */}
        <AnimatePresence>
          {showExpanded && (
            <motion.div
              key="expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="flex-1 min-h-0 overflow-y-auto border-b border-white/[0.06]"
            >
              <div className="px-4 sm:px-5 py-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-red-600/15 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                    <Mic2 className="w-4 h-4 text-red-400" />
                  </div>
                  <div>
                    <p className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-red-400 mb-0.5">Tani në emision</p>
                    <p className="text-white font-extrabold text-sm">Mëngjesi me Radio Fontana</p>
                    <p className="text-slate-500 text-xs">me Arjeta Krasniqi · 06:00 – 09:00</p>
                  </div>
                </div>
                {currentTime && (
                  <div className="text-2xl font-mono text-white/20 tabular-nums font-light tracking-widest">
                    {currentTime}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Controls bar ─────────────────────────────────────────────── */}
        <div className="flex-shrink-0 px-3 sm:px-4 py-2 flex items-center gap-2.5 sm:gap-3">

          {/* Station branding */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${playing ? 'bg-red-600/20 border border-red-500/30' : 'bg-white/[0.05] border border-white/[0.08]'}`}>
              <Radio className={`w-3.5 h-3.5 transition-colors duration-300 ${playing ? 'text-red-400' : 'text-slate-500'}`} />
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
                <div key={n} className="waveform-bar w-0.5 rounded-full bg-red-500 opacity-80" style={{ height: '6px' }} />
              ))}
            </div>
          )}

          {/* Volume */}
          <div className="flex items-center gap-2 flex-shrink-0 bg-white/[0.07] border border-white/[0.14] rounded-lg px-2.5 py-1.5">
            <button
              onClick={() => setMuted(!muted)}
              className="text-white/70 hover:text-white transition-colors flex-shrink-0"
              aria-label={muted ? 'Aktivizo tingullin' : 'Hiqe tingullin'}
            >
              {muted || volume === 0
                ? <VolumeX className="w-4 h-4" />
                : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={muted ? 0 : volume}
              onChange={handleVolumeChange}
              className="volume-slider w-20"
              style={{
                background: `linear-gradient(to right, #dc2626 ${(muted ? 0 : volume) * 100}%, rgba(255,255,255,0.15) ${(muted ? 0 : volume) * 100}%)`
              }}
              aria-label="Volumi"
            />
            <span className="text-[10px] text-white/40 tabular-nums w-7 text-right flex-shrink-0">
              {Math.round((muted ? 0 : volume) * 100)}%
            </span>
          </div>

          {/* Live badge */}
          {playing && (
            <span className="hidden sm:flex items-center gap-1 bg-red-600/15 border border-red-500/25 text-red-400 px-2 py-1 rounded-full text-[9px] font-extrabold tracking-wider flex-shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              LIVE
            </span>
          )}

          {/* Play / Pause */}
          <button
            onClick={togglePlay}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95 shadow-lg flex-shrink-0 ${
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
              <Play className="w-3.5 h-3.5 ml-0.5 opacity-60" />
            ) : playing ? (
              <Pause className="w-3.5 h-3.5" />
            ) : (
              <Play className="w-3.5 h-3.5 ml-0.5" />
            )}
          </button>

          {/* Expand / collapse toggle */}
          <button
            onClick={toggleExpand}
            className="hidden sm:flex p-1.5 text-slate-600 hover:text-white transition-colors rounded-lg hover:bg-white/[0.06] flex-shrink-0"
            aria-label={showExpanded ? 'Mbylle' : 'Hap'}
          >
            {showExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>

        </div>
      </div>
    </div>
  );
}

