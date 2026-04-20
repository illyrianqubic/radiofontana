'use client';

import { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Thermometer, Wind, Droplets } from 'lucide-react';

const mockWeather = {
  city: 'Pejë',
  country: 'Kosovë',
  temp: 18,
  feelsLike: 16,
  condition: 'Pjesërisht me re',
  humidity: 62,
  wind: 12,
  icon: 'partly-cloudy',
};

export default function WeatherWidget() {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const days = ['E Diel', 'E Hënë', 'E Martë', 'E Mërkurë', 'E Enjte', 'E Premte', 'E Shtunë'];
      const months = [
        'Janar', 'Shkurt', 'Mars', 'Prill', 'Maj', 'Qershor',
        'Korrik', 'Gusht', 'Shtator', 'Tetor', 'Nëntor', 'Dhjetor',
      ];
      setTime(now.toLocaleTimeString('sq-AL', { hour: '2-digit', minute: '2-digit' }));
      setDate(`${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const WeatherIcon = () => {
    switch (mockWeather.icon) {
      case 'sunny': return <Sun className="w-12 h-12 text-amber-400" />;
      case 'rainy': return <CloudRain className="w-12 h-12 text-blue-400" />;
      default: return <Cloud className="w-12 h-12 text-slate-300" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      {/* Time header */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-baseline justify-between mb-1">
          <p className="text-3xl font-bold tabular-nums tracking-tight text-slate-800">{time}</p>
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#e63946]">LIVE</span>
        </div>
        <p className="text-slate-400 text-sm">{date}</p>
      </div>

      {/* Divider */}
      <div className="mx-5 h-px bg-slate-100" />

      {/* Weather body */}
      <div className="px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400 mb-1.5">
              {mockWeather.city}, {mockWeather.country}
            </p>
            <div className="flex items-end gap-1">
              <span className="text-4xl font-bold text-slate-800 tracking-tight">{mockWeather.temp}°</span>
              <span className="text-slate-400 mb-1.5 text-sm font-medium">C</span>
            </div>
            <p className="text-slate-500 text-sm mt-0.5">{mockWeather.condition}</p>
          </div>
          <WeatherIcon />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 border-t border-slate-100">
        <div className="flex flex-col items-center py-3.5 border-r border-slate-100">
          <Thermometer className="w-3.5 h-3.5 text-slate-400 mb-1" />
          <span className="text-sm font-semibold text-slate-700">{mockWeather.feelsLike}°</span>
          <span className="text-[10px] text-slate-400">Ndjesia</span>
        </div>
        <div className="flex flex-col items-center py-3.5 border-r border-slate-100">
          <Droplets className="w-3.5 h-3.5 text-slate-400 mb-1" />
          <span className="text-sm font-semibold text-slate-700">{mockWeather.humidity}%</span>
          <span className="text-[10px] text-slate-400">Lagësia</span>
        </div>
        <div className="flex flex-col items-center py-3.5">
          <Wind className="w-3.5 h-3.5 text-slate-400 mb-1" />
          <span className="text-sm font-semibold text-slate-700">{mockWeather.wind}</span>
          <span className="text-[10px] text-slate-400">km/h</span>
        </div>
      </div>
    </div>
  );
}
