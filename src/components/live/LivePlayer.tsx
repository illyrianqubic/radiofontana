'use client';

import { Radio, Play, Pause, Clock, Volume2, Wifi } from 'lucide-react';
import { useAudioPlayer } from '@/lib/AudioPlayerContext';

// Note: the Facebook live embed and its /api/livestream fetch were removed
// — the iframe was permanently commented out and the data was unused.
// Dropping the dead code also removes framer-motion from this page (~50 KB
// gzip on first load); intro animations now use lightweight CSS keyframes
// declared in globals.css.

export default function LivePlayer() {
  const { playing, loading, error, togglePlay, prewarm } = useAudioPlayer();

  return (
    <div className="min-h-screen bg-slate-950 page-shell">
      {/* ── Radio Hero ── */}
      <div className="relative overflow-hidden">
        {/* Background glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-red-600/6 rounded-full blur-[140px]" />
          <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-red-900/4 rounded-full blur-[100px]" />
        </div>

        <div className="site-container relative z-10 flex flex-col items-center text-center text-white pt-14 md:pt-20 lg:pt-24 pb-16 md:pb-20 lg:pb-24">

          {/* Station icon */}
          <div className="mb-8 sm:mb-10 relative live-fade-in">
            <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center transition-all duration-500 ${
              playing
                ? 'bg-[#e63946]/15 border border-[#e63946]/35 shadow-[0_0_48px_rgba(230,57,70,0.20)]'
                : 'bg-white/[0.04] border border-white/[0.08]'
            }`}>
              <Radio className={`w-9 h-9 sm:w-11 sm:h-11 transition-colors duration-300 ${playing ? 'text-[#e63946]' : 'text-white/50'}`} />
            </div>
            {playing && (
              <span className="absolute -inset-2 rounded-[1.4rem] border border-[#e63946]/20 animate-ping opacity-30" />
            )}
          </div>

          {/* Status badge */}
          <div className="mb-5 live-slide-up live-delay-150">
            {error ? (
              <span className="inline-flex items-center gap-2 bg-slate-800/80 text-slate-300 text-[11px] md:text-sm font-semibold px-4 py-1.5 rounded-full tracking-[0.16em] uppercase">
                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full" />
                Transmetimi ndalur
              </span>
            ) : playing ? (
              <span className="inline-flex items-center gap-2 bg-[#e63946] text-white text-[11px] md:text-sm font-extrabold px-4 py-1.5 rounded-full tracking-[0.16em] uppercase shadow-lg shadow-[#e63946]/25">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                Duke transmetuar live
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 bg-white/[0.05] border border-white/[0.07] text-white/40 text-[11px] md:text-sm font-semibold px-4 py-1.5 rounded-full tracking-[0.16em] uppercase">
                <span className="w-1.5 h-1.5 bg-white/25 rounded-full" />
                Ndal
              </span>
            )}
          </div>

          {/* Title + subtitle */}
          <div className="mb-8 sm:mb-10 live-slide-up live-delay-220">
            <h1 className="ipad-page-title text-[2rem] md:text-[2.3rem] lg:text-[2.8rem] xl:text-[3rem] 2xl:text-[3.4rem] 3xl:text-[3.8rem] font-extrabold tracking-tight mb-2 leading-none break-words">
              Radio Fontana 98.8 FM
            </h1>
            <p className="text-slate-300 text-base md:text-lg 2xl:text-xl font-medium">
              98.8 FM &middot; Istog, Kosovë
            </p>
            <p className="text-slate-400 text-sm md:text-base 2xl:text-lg mt-1">
              Transmetim 24/7 me cilësi të lartë
            </p>
          </div>

          {/* Play button */}
          <button
            type="button"
            onClick={togglePlay}
            onPointerDown={prewarm}
            onPointerEnter={prewarm}
            onTouchStart={prewarm}
            className={`touch-target w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center mb-10 sm:mb-12 transition-transform duration-200 hover:scale-105 active:scale-95 live-scale-in live-delay-300 ${
              error
                ? 'bg-slate-700 hover:bg-slate-600 text-slate-300 shadow-2xl'
                : playing
                ? 'bg-[#e63946] hover:bg-[#d32f3f] text-white shadow-[0_8px_40px_rgba(230,57,70,0.40)]'
                : 'bg-white hover:bg-slate-100 text-slate-900 shadow-[0_8px_32px_rgba(255,255,255,0.12)]'
            }`}
            aria-label={playing ? 'Ndalo' : error ? 'Provo përsëri' : 'Luaj'}
          >
            {loading ? (
              <div className={`w-7 h-7 border-2 rounded-full animate-spin ${playing ? 'border-white border-t-transparent' : 'border-slate-900 border-t-transparent'}`} />
            ) : error ? (
              <Play className="w-7 h-7 ml-1 opacity-60" />
            ) : playing ? (
              <Pause className="w-7 h-7" />
            ) : (
              <Play className="w-7 h-7 ml-1" />
            )}
          </button>

          {/* Waveform (playing only) — pure CSS, no framer-motion */}
          {playing && (
            <div className="flex items-end justify-center gap-[3px] h-7 sm:h-9 mb-10 sm:mb-12 live-fade-in">
              {Array.from({ length: 18 }, (_, i) => (
                <span
                  key={i}
                  className="w-[3px] bg-[#e63946] rounded-full live-bar"
                  style={{ animationDelay: `${(i * 0.045).toFixed(3)}s` }}
                />
              ))}
            </div>
          )}

          {/* Info cards */}
          <div className="grid grid-cols-3 gap-3 md:gap-4 w-full max-w-xs md:max-w-2xl live-slide-up live-delay-380">
            <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl px-3 md:px-5 py-4 md:py-5 flex flex-col items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" />
              <p className="text-lg md:text-2xl font-bold text-white leading-none">24/7</p>
              <p className="text-xs md:text-sm text-slate-400 uppercase tracking-widest font-bold">Live</p>
            </div>
            <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl px-3 md:px-5 py-4 md:py-5 flex flex-col items-center gap-2">
              <Volume2 className="w-4 h-4 text-slate-500" />
              <p className="text-lg md:text-2xl font-bold text-white leading-none">HQ</p>
              <p className="text-xs md:text-sm text-slate-400 uppercase tracking-widest font-bold">320kbps</p>
            </div>
            <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl px-3 md:px-5 py-4 md:py-5 flex flex-col items-center gap-2">
              <Wifi className="w-4 h-4 text-slate-500" />
              <p className="text-lg md:text-2xl font-bold text-white leading-none">FM</p>
              <p className="text-xs md:text-sm text-slate-400 uppercase tracking-widest font-bold">98.8</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
