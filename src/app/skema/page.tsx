import { Metadata } from 'next';
import scheduleData from '@/data/schedule.json';

export const runtime = 'edge';
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
          <span>Kryefaqja</span>
          <span>›</span>
          <span className="text-gray-900 dark:text-white font-medium">Skema Programore</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white section-title mb-2">
          Skema Programore
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Zbuloni emisionet dhe programet tona javore. Radio Fontana transmeton 24 orë në ditë.
        </p>
      </div>

      {/* Current show banner */}
      <div className="bg-gradient-to-r from-[#1a3a6b] to-[#2563eb] rounded-xl p-6 text-white mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
          <Mic2 className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <p className="text-blue-200 text-xs font-semibold uppercase tracking-wider mb-0.5">Tani në Emision</p>
          <p className="font-bold text-xl">Mëngjesi me Radio Fontana</p>
          <p className="text-blue-200">me Arjeta Krasniqi · 06:00 - 09:00</p>
        </div>
        <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full self-start sm:self-auto">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-sm font-bold">LIVE</span>
        </div>
      </div>

      {/* Schedule grid */}
      <div className="space-y-6">
        {days.map((dayData) => {
          const isToday = dayData.day === today;
          return (
            <div
              key={dayData.day}
              id={dayData.day}
              className={`bg-white dark:bg-gray-800 rounded-xl border shadow-sm overflow-hidden ${
                isToday
                  ? 'border-[#1a3a6b] dark:border-blue-500 ring-2 ring-[#1a3a6b]/20 dark:ring-blue-500/20'
                  : 'border-gray-100 dark:border-gray-700'
              }`}
            >
              {/* Day header */}
              <div className={`px-5 py-4 flex items-center justify-between ${isToday ? 'bg-[#1a3a6b] text-white' : 'bg-gray-50 dark:bg-gray-700/50'}`}>
                <h2 className={`font-bold text-lg ${isToday ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  {dayData.day}
                </h2>
                {isToday && (
                  <span className="flex items-center gap-1.5 bg-white/20 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    SOT
                  </span>
                )}
              </div>

              {/* Slots */}
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {dayData.slots.map((slot, i) => (
                  <div key={i} className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3 hover:bg-blue-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="flex items-center gap-2 sm:w-32 flex-shrink-0">
                      <Clock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      <span className="text-sm font-mono text-gray-600 dark:text-gray-400 whitespace-nowrap">{slot.time}</span>
                    </div>
                    <div className="flex-1 min-w-0 sm:border-l sm:border-gray-200 sm:dark:border-gray-600 sm:pl-4">
                      <p className="font-semibold text-gray-900 dark:text-white">{slot.show}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{slot.description}</p>
                    </div>
                    <div className="sm:w-40 flex-shrink-0">
                      <p className="text-sm text-[#1a3a6b] dark:text-blue-400 font-medium">me {slot.host}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Note */}
      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
        * Skema programore mund të ndryshojë pa njoftim. Ndiqni faqen tonë për informacionin më të ri.
      </p>
    </div>
  );
}
