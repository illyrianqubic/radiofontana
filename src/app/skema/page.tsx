import { Metadata } from 'next';
import scheduleData from '@/data/schedule.json';
import { Clock, Mic2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Skema Programore',
  description: 'Skema e plotë programore e Radio Fontana. Shikoni emisionet tona ditore.',
};

const days = scheduleData as Array<{ day: string; slots: Array<{ time: string; show: string; host: string; description: string }> }>;

const currentDay = () => {
  const d = new Date().getDay();
  const names = ['E Diel', 'E Hënë', 'E Martë', 'E Mërkurë', 'E Enjte', 'E Premte', 'E Shtunë'];
  return names[d];
};

export default function SkemaPage() {
  const today = currentDay();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-10 page-shell">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
          <span>Kryefaqja</span>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">Skema Programore</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
          Skema Programore
        </h1>
        <p className="text-slate-500 text-base">
          Zbuloni emisionet dhe programet tona javore. Radio Fontana transmeton 24 orë në ditë.
        </p>
      </div>

      {/* Current show banner */}
      <div className="bg-red-600 rounded-2xl p-5 sm:p-7 text-white mb-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
        <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0">
          <Mic2 className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-white/70 mb-1">Tani në Emision</p>
          <p className="font-bold text-xl">Mëngjesi me Radio Fontana</p>
          <p className="text-white/70 text-sm">me Arjeta Krasniqi · 06:00 - 09:00</p>
        </div>
        <div className="flex items-center gap-2 bg-white/20 px-3.5 py-2 rounded-full self-start sm:self-auto">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
          <span className="text-[10px] font-extrabold tracking-wider">LIVE</span>
        </div>
      </div>

      {/* Schedule grid */}
      <div className="space-y-5">
        {days.map((dayData) => {
          const isToday = dayData.day === today;
          return (
            <div
              key={dayData.day}
              id={dayData.day}
              className={`bg-white rounded-2xl border overflow-hidden transition-all ${
                isToday
                  ? 'border-[#e63946]/30 ring-1 ring-[#e63946]/10'
                  : 'border-slate-100'
              }`}
            >
              {/* Day header */}
              <div className={`px-4 sm:px-6 py-3 sm:py-4 flex flex-wrap items-center justify-between gap-2 ${isToday ? 'bg-[#e63946] text-white' : 'bg-slate-50'}`}>
                <h2 className={`font-bold text-lg ${isToday ? 'text-white' : 'text-slate-800'}`}>
                  {dayData.day}
                </h2>
                {isToday && (
                  <span className="flex items-center gap-1.5 bg-white text-[#e63946] text-[10px] font-extrabold px-3 py-1.5 rounded-full tracking-wider">
                    <span className="w-1.5 h-1.5 bg-[#e63946] rounded-full animate-pulse" />
                    SOT
                  </span>
                )}
              </div>

              {/* Slots */}
              <div className="divide-y divide-slate-50">
                {dayData.slots.map((slot, i) => (
                  <div key={i} className="px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 hover:bg-slate-50 transition-colors duration-200">
                    <div className="flex items-center gap-2 sm:gap-2.5 sm:w-32 flex-shrink-0">
                      <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-300 flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-mono text-slate-400 whitespace-nowrap">{slot.time}</span>
                    </div>
                    <div className="flex-1 min-w-0 sm:border-l sm:border-slate-100 sm:pl-5">
                      <p className="font-semibold text-slate-800">{slot.show}</p>
                      <p className="text-sm text-slate-400 mt-0.5">{slot.description}</p>
                    </div>
                    <div className="sm:w-40 flex-shrink-0">
                      <p className="text-sm text-[#e63946] font-medium">me {slot.host}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Note */}
      <p className="text-center text-sm text-slate-400 mt-10">
        * Skema programore mund të ndryshojë pa njoftim. Ndiqni faqen tonë për informacionin më të ri.
      </p>
    </div>
  );
}
