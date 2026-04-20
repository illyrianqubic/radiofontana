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
    <div className="min-h-screen bg-gradient-to-b from-[#0f2347] to-[#1a3a6b]">
      <div className="max-w-4xl mx-auto px-4 pt-16 pb-12 text-center text-white">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <div className="relative">
            <div className={`w-28 h-28 rounded-full bg-white/10 border-4 ${playing ? 'border-green-400' : 'border-white/30'} flex items-center justify-center transition-colors duration-300`}>
              <Radio className="w-12 h-12 text-white" />
            </div>
            {playing && (
              <>
                <div className="absolute inset-0 rounded-full border-4 border-green-400 animate-ping opacity-30" />
                <div className="absolute -inset-3 rounded-full border-2 border-green-400/20 animate-ping opacity-20" style={{ animationDelay: '0.5s' }} />
              </>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-center mb-3">
            {playing ? (
              <span className="flex items-center gap-2 bg-green-500 text-white text-sm font-bold px-4 py-1.5 rounded-full">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                DUKE TRANSMETUAR LIVE
              </span>
            ) : (
              <span className="flex items-center gap-2 bg-white/20 text-white/80 text-sm font-medium px-4 py-1.5 rounded-full">
                <span className="w-2 h-2 bg-white/50 rounded-full" />
                NDAL
              </span>
            )}
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold mb-2">Radio Fontana</h1>
          <p className="text-blue-200 text-lg mb-1">96.5 FM · Pejë, Kosovë</p>
          <p className="text-blue-300 text-sm mb-8">Duke transmetuar 24 orë në ditë, 7 ditë në javë</p>

          <button
            onClick={handlePlay}
            className="group w-20 h-20 mx-auto rounded-full bg-white text-[#1a3a6b] hover:bg-blue-50 transition-all shadow-2xl flex items-center justify-center mb-8 hover:scale-105 active:scale-95"
            aria-label={playing ? 'Ndalo' : 'Luaj'}
          >
            {loading ? (
              <div className="w-7 h-7 border-2 border-[#1a3a6b] border-t-transparent rounded-full animate-spin" />
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
              className="flex items-end justify-center gap-1 h-8 mb-6"
            >
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1.5 bg-green-400 rounded-full"
                  animate={{ height: ['30%', '100%', '50%', '80%', '20%'] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.07, ease: 'easeInOut' }}
                />
              ))}
            </motion.div>
          )}

          <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <Users className="w-5 h-5 mx-auto text-blue-300 mb-1" />
              <p className="text-xl font-bold">2.4K</p>
              <p className="text-xs text-blue-300">Dëgjues</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <Clock className="w-5 h-5 mx-auto text-blue-300 mb-1" />
              <p className="text-xl font-bold">24/7</p>
              <p className="text-xs text-blue-300">Transmetim</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <Volume2 className="w-5 h-5 mx-auto text-blue-300 mb-1" />
              <p className="text-xl font-bold">HQ</p>
              <p className="text-xs text-blue-300">Audio 320kbps</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-t-3xl">
        <div className="max-w-4xl mx-auto px-4 py-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white section-title mb-6">
            Tani në Emision
          </h2>

          <div className="bg-gradient-to-r from-[#1a3a6b] to-[#2563eb] rounded-xl p-6 text-white mb-8 flex items-center gap-5">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Mic2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-blue-200 text-xs font-semibold uppercase tracking-wider mb-0.5">Tani</p>
              <p className="font-bold text-xl">Mëngjesi me Radio Fontana</p>
              <p className="text-blue-200">me Arjeta Krasniqi · 06:00 - 09:00</p>
            </div>
            <div className="ml-auto hidden sm:flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm font-semibold">LIVE</span>
            </div>
          </div>

          <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-4">Emisionet e Sotme</h3>
          <div className="space-y-3">
            {programs.map((p, i) => (
              <div
                key={i}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-colors ${
                  p.live
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                    : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700'
                }`}
              >
                <div className="text-sm font-mono text-gray-500 dark:text-gray-400 w-28 flex-shrink-0">{p.time}</div>
                <div className="flex-1">
                  <p className={`font-semibold ${p.live ? 'text-[#1a3a6b] dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
                    {p.show}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">me {p.host}</p>
                </div>
                {p.live && (
                  <span className="flex items-center gap-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
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
