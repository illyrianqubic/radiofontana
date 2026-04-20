'use client';

import { useState } from 'react';
import { Radio, Play, Pause, Users, Clock, Mic2, Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';

const programs = [
  { time: '06:00 - 09:00', show: 'Mëngjesi me Radio Fontana', host: 'Arjeta Krasniqi', live: true },
  { time: '09:00 - 12:00', show: 'Magazina e Mëngjesit', host: 'Besnik Gashi', live: false },
  { time: '12:00 - 14:00', show: 'Lajmet e Drekës', host: 'Valbona Morina', live: false },
  { time: '14:00 - 17:00', show: 'Pasdite me Fontana', host: 'Rinor Haxhiaj', live: false },
];

export default function LivePlayer() {
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePlay = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setPlaying(!playing);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero */}
      <div className="relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#e63946]/8 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-4xl mx-auto px-4 pt-20 pb-16 text-center text-white relative z-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              <div className={`w-32 h-32 rounded-3xl flex items-center justify-center transition-all duration-500 ${
                playing
                  ? 'bg-[#e63946]/15 border-2 border-[#e63946]/30 shadow-2xl shadow-[#e63946]/20'
                  : 'bg-white/[0.04] border-2 border-white/10'
              }`}>
                <Radio className={`w-14 h-14 transition-colors duration-300 ${playing ? 'text-[#e63946]' : 'text-white/60'}`} />
              </div>
              {playing && (
                <div className="absolute -inset-2 rounded-[1.5rem] border border-[#e63946]/20 animate-ping opacity-40" />
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex justify-center mb-4">
              {playing ? (
                <span className="flex items-center gap-2 bg-[#e63946] text-white text-xs font-extrabold px-4 py-2 rounded-full tracking-wider shadow-lg shadow-[#e63946]/30">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  DUKE TRANSMETUAR LIVE
                </span>
              ) : (
                <span className="flex items-center gap-2 bg-white/[0.06] text-white/50 text-xs font-medium px-4 py-2 rounded-full">
                  <span className="w-2 h-2 bg-white/30 rounded-full" />
                  NDAL
                </span>
              )}
            </div>

            <h1 className="text-5xl sm:text-6xl font-bold mb-3 tracking-tight">Radio Fontana</h1>
            <p className="text-slate-400 text-lg mb-1">96.5 FM · Pejë, Kosovë</p>
            <p className="text-slate-600 text-sm mb-10">Transmetim 24/7 me cilësi të lartë</p>

            <button
              onClick={handlePlay}
              className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-10 transition-all duration-300 hover:scale-105 active:scale-95 ${
                playing
                  ? 'bg-[#e63946] hover:bg-[#d32f3f] text-white shadow-2xl shadow-[#e63946]/30'
                  : 'bg-white hover:bg-slate-100 text-slate-900 shadow-2xl'
              }`}
              aria-label={playing ? 'Ndalo' : 'Luaj'}
            >
              {loading ? (
                <div className={`w-7 h-7 border-2 rounded-full animate-spin ${playing ? 'border-white border-t-transparent' : 'border-slate-900 border-t-transparent'}`} />
              ) : playing ? (
                <Pause className="w-8 h-8" />
              ) : (
                <Play className="w-8 h-8 ml-1" />
              )}
            </button>

            {playing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-end justify-center gap-[3px] h-8 mb-8"
              >
                {[...Array(16)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-[#e63946] rounded-full"
                    animate={{ height: ['20%', '100%', '40%', '80%', '30%'] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.05, ease: 'easeInOut' }}
                  />
                ))}
              </motion.div>
            )}

            <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
              <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-4 text-center">
                <Users className="w-5 h-5 mx-auto text-slate-500 mb-1.5" />
                <p className="text-xl font-bold text-white">2.4K</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Dëgjues</p>
              </div>
              <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-4 text-center">
                <Clock className="w-5 h-5 mx-auto text-slate-500 mb-1.5" />
                <p className="text-xl font-bold text-white">24/7</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Live</p>
              </div>
              <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-4 text-center">
                <Volume2 className="w-5 h-5 mx-auto text-slate-500 mb-1.5" />
                <p className="text-xl font-bold text-white">HQ</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">320kbps</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Schedule section */}
      <div className="bg-white dark:bg-slate-900 rounded-t-[2rem]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white section-title mb-7">
            Tani në Emision
          </h2>

          <div className="bg-slate-950 rounded-2xl p-6 text-white mb-10 flex items-center gap-5 border border-white/[0.06]">
            <div className="w-14 h-14 bg-[#e63946]/10 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Mic2 className="w-6 h-6 text-[#e63946]" />
            </div>
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#e63946] mb-0.5">Tani</p>
              <p className="font-bold text-xl">Mëngjesi me Radio Fontana</p>
              <p className="text-slate-400 text-sm">me Arjeta Krasniqi · 06:00 - 09:00</p>
            </div>
            <div className="ml-auto hidden sm:flex items-center gap-1.5 bg-[#e63946] px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span className="text-[10px] font-extrabold tracking-wider">LIVE</span>
            </div>
          </div>

          <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-5">Emisionet e Sotme</h3>
          <div className="space-y-2.5">
            {programs.map((p, i) => (
              <div
                key={i}
                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 ${
                  p.live
                    ? 'bg-[#e63946]/5 dark:bg-[#e63946]/10 border-[#e63946]/20'
                    : 'bg-white dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="text-sm font-mono text-slate-400 w-28 flex-shrink-0">{p.time}</div>
                <div className="flex-1">
                  <p className={`font-semibold ${p.live ? 'text-[#e63946]' : 'text-slate-800 dark:text-white'}`}>
                    {p.show}
                  </p>
                  <p className="text-sm text-slate-400">me {p.host}</p>
                </div>
                {p.live && (
                  <span className="flex items-center gap-1.5 bg-[#e63946] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full tracking-wider">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    LIVE
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
