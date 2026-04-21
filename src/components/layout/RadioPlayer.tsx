'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { Play, Pause, Volume2, VolumeX, Radio, ChevronUp, ChevronDown, Mic2, GripHorizontal } from 'lucide-react';
import { useAudioPlayer } from '@/lib/AudioPlayerContext';

// ── Constraints ──────────────────────────────────────────────────────────────
const MIN_W = 260;
const MAX_W = 960;
const MIN_H = 76;
const MAX_H = 440;
const STORAGE_KEY = 'rf_player_v3';
const EDGE_GAP = 8;
// ─────────────────────────────────────────────────────────────────────────────

/**
 * dragged=false  →  render with CSS bottom/left/transform (always visible, zoom-safe)
 * dragged=true   →  render with explicit left/top pixel coords (where the user placed it)
 */
interface PS {
  dragged: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
}

const DEFAULT_W = 520;

function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }

function clampPS(s: PS): PS {
  const viewportMax = typeof window === 'undefined'
    ? MAX_W
    : Math.max(MIN_W, window.innerWidth - EDGE_GAP * 2);
  const width  = clamp(s.width,  MIN_W, Math.min(MAX_W, viewportMax));
  const height = clamp(s.height, MIN_H, MAX_H);
  if (typeof window === 'undefined' || !s.dragged) return { ...s, width, height };
  const x = clamp(s.x, 0, Math.max(0, window.innerWidth  - width));
  const y = clamp(s.y, 0, Math.max(0, window.innerHeight - height));
  return { ...s, x, y, width, height };
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
  const [ps, setPs] = useState<PS>(() => loadPS() ?? ({ dragged: false, x: 0, y: 0, width: DEFAULT_W, height: MIN_H }));
  const [mounted, setMounted] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);

  // Mark client mount to avoid SSR/client mismatch on fixed positioning.
  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const syncViewport = () => {
      const width = window.innerWidth;
      requestAnimationFrame(() => setViewportWidth(width));
    };
    syncViewport();
    window.addEventListener('resize', syncViewport);
    return () => window.removeEventListener('resize', syncViewport);
  }, []);

  useEffect(() => {
    if (!viewportWidth) return;
    const raf = requestAnimationFrame(() => {
      setPs((prev) => clampPS(prev));
    });
    return () => cancelAnimationFrame(raf);
  }, [viewportWidth]);

  // Keep the first-landing centered player a bit wider unless user has manually moved/resized it.
  useEffect(() => {
    if (!mounted || !viewportWidth) return;
    const raf = requestAnimationFrame(() => {
      setPs((prev) => {
        if (prev.dragged || prev.width >= DEFAULT_W) {
          return prev;
        }
        return clampPS({ ...prev, width: DEFAULT_W });
      });
    });
    return () => cancelAnimationFrame(raf);
  }, [mounted, viewportWidth]);

  // Persist after mount
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

  // Expand / collapse
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

    // Convert current CSS position to pixel coords before first move
    const rect = panelRef.current!.getBoundingClientRect();
    const startX = rect.left;
    const startY = rect.top;
    const originX = e.clientX - startX;
    const originY = e.clientY - startY;

    // Switch to dragged mode immediately so resize handles can see it
    setPs(prev => clampPS({ ...prev, dragged: true, x: startX, y: startY }));

    const onMove = (ev: PointerEvent) => {
      const nx = ev.clientX - originX;
      const ny = ev.clientY - originY;
      setPs(prev => clampPS({ ...prev, dragged: true, x: nx, y: ny }));
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

      // Capture actual pixel rect (works for both CSS-centered and dragged)
      const rect = panelRef.current!.getBoundingClientRect();
      const x0 = rect.left, y0 = rect.top, w0 = rect.width, h0 = rect.height;
      const sx = e.clientX, sy = e.clientY;

      const onMove = (ev: PointerEvent) => {
        const dx = ev.clientX - sx;
        const dy = ev.clientY - sy;
        let nx = x0, ny = y0, nw = w0, nh = h0;
        if (edges.r) nw = w0 + dx;
        if (edges.l) { nw = w0 - dx; nx = x0 + dx; }
        if (edges.b) nh = h0 + dy;
        if (edges.t) { nh = h0 - dy; ny = y0 + dy; }
        if (edges.l && nw < MIN_W) { nw = MIN_W; nx = x0 + w0 - MIN_W; }
        if (edges.t && nh < MIN_H) { nh = MIN_H; ny = y0 + h0 - MIN_H; }
        setPs(clampPS({ dragged: true, x: nx, y: ny, width: nw, height: nh }));
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
  const maxViewportWidth = viewportWidth
    ? Math.max(MIN_W, viewportWidth - EDGE_GAP * 2)
    : MAX_W;
  const effectiveWidth = clamp(ps.width, MIN_W, Math.min(MAX_W, maxViewportWidth));

  // Build the outer container style
  // Default (not dragged): CSS-centered at bottom — survives scroll/zoom perfectly
  // Dragged: explicit left/top so it stays exactly where the user put it
  const outerStyle: React.CSSProperties = ps.dragged
    ? { position: 'fixed', left: ps.x, top: ps.y, width: effectiveWidth, height: ps.height, zIndex: 9999 }
    : { position: 'fixed', bottom: EDGE_GAP, left: '50%', transform: 'translateX(-50%)', width: effectiveWidth, height: ps.height, zIndex: 9999 };

  if (pathname.startsWith('/studio')) return null;
  if (!mounted) return null;

  return (
    <div className="select-none" style={outerStyle}>
      {/* ── Edge resize handles ──────────────────────────────────────────── */}
      <div className="absolute top-0    left-3  right-3  h-1.5 z-20 cursor-ns-resize"  onPointerDown={onEdgeDown({ t: 1 })}       style={{ touchAction: 'none' }} />
      <div className="absolute bottom-0 left-3  right-3  h-1.5 z-20 cursor-ns-resize"  onPointerDown={onEdgeDown({ b: 1 })}       style={{ touchAction: 'none' }} />
      <div className="absolute left-0   top-3   bottom-3 w-1.5 z-20 cursor-ew-resize"  onPointerDown={onEdgeDown({ l: 1 })}       style={{ touchAction: 'none' }} />
      <div className="absolute right-0  top-3   bottom-3 w-1.5 z-20 cursor-ew-resize"  onPointerDown={onEdgeDown({ r: 1 })}       style={{ touchAction: 'none' }} />
      <div className="absolute top-0    left-0  w-3 h-3  z-30 cursor-nwse-resize"      onPointerDown={onEdgeDown({ t: 1, l: 1 })} style={{ touchAction: 'none' }} />
      <div className="absolute top-0    right-0 w-3 h-3  z-30 cursor-nesw-resize"      onPointerDown={onEdgeDown({ t: 1, r: 1 })} style={{ touchAction: 'none' }} />
      <div className="absolute bottom-0 left-0  w-3 h-3  z-30 cursor-nesw-resize"      onPointerDown={onEdgeDown({ b: 1, l: 1 })} style={{ touchAction: 'none' }} />
      <div className="absolute bottom-0 right-0 w-3 h-3  z-30 cursor-nwse-resize"      onPointerDown={onEdgeDown({ b: 1, r: 1 })} style={{ touchAction: 'none' }} />

      {/* ── Main panel ───────────────────────────────────────────────────── */}
      <div
        ref={panelRef}
        className="absolute inset-0 bg-black rounded-xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.7),0_2px_12px_rgba(0,0,0,0.5)] border border-white/[0.09] flex flex-col radio-player"
      >
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
        {showExpanded && (
          <div className="flex-1 min-h-0 overflow-y-auto border-b border-white/[0.06]">
            <div className="px-4 py-3 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-600/15 border border-red-500/20 flex items-center justify-center flex-shrink-0">
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
          </div>
        )}

        {/* ── Controls bar ─────────────────────────────────────────────── */}
        <div className="flex-shrink-0 px-2.5 sm:px-3 py-2 flex items-center gap-2 sm:gap-3">

          {/* Station branding */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${playing ? 'bg-red-600/20 border border-red-500/30' : 'bg-white/[0.05] border border-white/[0.08]'}`}>
              <Radio className={`w-3 h-3 transition-colors duration-300 ${playing ? 'text-red-400' : 'text-slate-500'}`} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-bold text-white leading-tight truncate">Radio Fontana</p>
                <span className="hidden sm:block text-[10px] text-slate-600">98.8 FM</span>
              </div>
              <p className="text-[9px] text-slate-500 truncate">
                {error
                  ? 'Transmetimi nuk është i disponueshëm'
                  : playing
                  ? 'Duke transmetuar live · Istog, Kosovë'
                  : 'Klikoni play për të dëgjuar'}
              </p>
            </div>
          </div>

          {/* Waveform */}
          {playing && (
            <div className="hidden sm:flex items-center gap-0.5 h-4 flex-shrink-0">
              {[1, 2, 3, 4, 5].map((n) => (
                <div key={n} className="waveform-bar w-0.5 rounded-full bg-red-500 opacity-80" style={{ height: '5px' }} />
              ))}
            </div>
          )}

          {/* Volume */}
          <div className="hidden min-[430px]:flex items-center gap-1.5 h-9 flex-shrink-0 bg-white/[0.07] border border-white/[0.14] rounded-md px-1.5">
            <button
              onClick={() => setMuted(!muted)}
              className="touch-target inline-flex items-center justify-center h-7 w-7 text-white/65 hover:text-white transition-colors flex-shrink-0 leading-none"
              aria-label={muted ? 'Aktivizo tingullin' : 'Hiqe tingullin'}
            >
              {muted || volume === 0
                ? <VolumeX className="w-3 h-3" />
                : <Volume2 className="w-3 h-3" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={muted ? 0 : volume}
              onChange={handleVolumeChange}
              className="volume-slider w-14 sm:w-16"
              style={{
                background: `linear-gradient(to right, #dc2626 ${(muted ? 0 : volume) * 100}%, rgba(255,255,255,0.15) ${(muted ? 0 : volume) * 100}%)`
              }}
              aria-label="Volumi"
            />
            <span className="text-[9px] text-white/40 tabular-nums w-6 text-right flex-shrink-0 leading-none">
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
            className={`touch-target w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95 shadow-md flex-shrink-0 ${
              error
                ? 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                : playing
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-white hover:bg-slate-100 text-slate-900'
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

          {/* Expand / collapse */}
          <button
            onClick={toggleExpand}
            className="hidden sm:flex touch-target p-1 text-slate-600 hover:text-white transition-colors rounded-md hover:bg-white/[0.06] flex-shrink-0"
            aria-label={showExpanded ? 'Mbylle' : 'Hap'}
          >
            {showExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>

        </div>
      </div>
    </div>
  );
}


