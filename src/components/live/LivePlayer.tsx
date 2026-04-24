'use client';

import { useEffect, useState } from 'react';
import { Radio, Play, Pause, Clock, Volume2, Wifi } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAudioPlayer } from '@/lib/AudioPlayerContext';
import { LiveStream } from '@/lib/types';

const FALLBACK_FB_URL =
  'https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Frtvfontanalive&show_text=false&autoplay=true&width=1280';

function buildFbEmbedUrl(facebookUrl: string | null): string {
  if (!facebookUrl) return FALLBACK_FB_URL;
  return (
    `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(facebookUrl)}` +
    `&show_text=false&autoplay=true&width=1280`
  );
}

export default function LivePlayer() {
  const { playing, loading, error, togglePlay } = useAudioPlayer();
  const [stream, setStream] = useState<LiveStream | null>(null);

  useEffect(() => {
    fetch('/api/livestream')
      .then((r) => r.json())
      .then((data: LiveStream) => setStream(data))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 page-shell">

      <div className="w-full bg-black/90 border-b border-white/10">
        <div className="mx-auto w-full max-w-[1120px] overflow-hidden sm:rounded-b-2xl sm:border-x sm:border-b sm:border-white/10">
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src={buildFbEmbedUrl(stream?.facebookUrl ?? null)}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none', overflow: 'hidden' }}
              scrolling="no"
              frameBorder={0}
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            />
          </div>
        </div>
      </div>

      {/* ── Radio Hero ── */}
      <div className="relative overflow-hidden">
        {/* Background glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-red-600/6 rounded-full blur-[140px]" />
          <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-red-900/4 rounded-full blur-[100px]" />
        </div>

        <div className="site-container relative z-10 flex flex-col items-center text-center text-white pt-14 sm:pt-20 lg:pt-24 pb-16 sm:pb-20 lg:pb-24">

          {/* Station icon */}
          <motion.div
            initial={{ scale: 0.75, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="mb-8 sm:mb-10 relative"
          >
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
          </motion.div>

          {/* Status badge */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="mb-5"
          >
            {error ? (
              <span className="inline-flex items-center gap-2 bg-slate-800/80 text-slate-400 text-[11px] font-semibold px-4 py-1.5 rounded-full tracking-widest uppercase">
                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full" />
                Transmetimi ndalur
              </span>
            ) : playing ? (
              <span className="inline-flex items-center gap-2 bg-[#e63946] text-white text-[11px] font-extrabold px-4 py-1.5 rounded-full tracking-widest uppercase shadow-lg shadow-[#e63946]/25">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                Duke transmetuar live
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 bg-white/[0.05] border border-white/[0.07] text-white/40 text-[11px] font-semibold px-4 py-1.5 rounded-full tracking-widest uppercase">
                <span className="w-1.5 h-1.5 bg-white/25 rounded-full" />
                Ndal
              </span>
            )}
          </motion.div>

          {/* Title + subtitle */}
          <motion.div
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.22 }}
            className="mb-8 sm:mb-10"
          >
            <h1 className="text-[1.5rem] sm:text-4xl lg:text-5xl xl:text-[3rem] font-extrabold tracking-tight mb-2 leading-none">
              Radio Fontana
            </h1>
            <p className="text-slate-400 text-sm sm:text-base font-medium">
              98.8 FM &middot; Istog, Kosovë
            </p>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              Transmetim 24/7 me cilësi të lartë
            </p>
          </motion.div>

          {/* Play button */}
          <motion.button
            onClick={togglePlay}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mb-10 sm:mb-12 transition-colors duration-300 ${
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
          </motion.button>

          {/* Waveform (playing only) */}
          {playing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-end justify-center gap-[3px] h-7 sm:h-9 mb-10 sm:mb-12"
            >
              {[...Array(18)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-[3px] bg-[#e63946] rounded-full"
                  animate={{ height: ['20%', '100%', '40%', '80%', '30%'] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.045, ease: 'easeInOut' }}
                />
              ))}
            </motion.div>
          )}

          {/* Info cards */}
          <motion.div
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.38 }}
            className="grid grid-cols-3 gap-3 sm:gap-4 w-full max-w-xs sm:max-w-sm"
          >
            <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl px-3 py-4 flex flex-col items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" />
              <p className="text-lg sm:text-xl font-bold text-white leading-none">24/7</p>
              <p className="text-[9px] sm:text-[10px] text-slate-600 uppercase tracking-widest font-bold">Live</p>
            </div>
            <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl px-3 py-4 flex flex-col items-center gap-2">
              <Volume2 className="w-4 h-4 text-slate-500" />
              <p className="text-lg sm:text-xl font-bold text-white leading-none">HQ</p>
              <p className="text-[9px] sm:text-[10px] text-slate-600 uppercase tracking-widest font-bold">320kbps</p>
            </div>
            <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl px-3 py-4 flex flex-col items-center gap-2">
              <Wifi className="w-4 h-4 text-slate-500" />
              <p className="text-lg sm:text-xl font-bold text-white leading-none">FM</p>
              <p className="text-[9px] sm:text-[10px] text-slate-600 uppercase tracking-widest font-bold">98.8</p>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}

