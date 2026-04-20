'use client';

import { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Thermometer, Wind, Droplets } from 'lucide-react';

const mockWeather = {
  city: 'Pejë, Kosovë',
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
      setDate(`${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const WeatherIcon = () => {
    switch (mockWeather.icon) {
      case 'sunny': return <Sun className="w-10 h-10 text-yellow-400" />;
      case 'rainy': return <CloudRain className="w-10 h-10 text-blue-400" />;
      default: return <Cloud className="w-10 h-10 text-gray-300" />;
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#1a3a6b] to-[#0f2347] text-white rounded-xl p-5 shadow-lg">
      {/* Date & Time */}
      <div className="mb-4 pb-4 border-b border-white/10">
        <p className="text-3xl font-mono font-bold tabular-nums">{time}</p>
        <p className="text-blue-200 text-sm mt-0.5">{date}</p>
      </div>

      {/* Weather */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-blue-300 font-semibold uppercase tracking-wider mb-1">
            {mockWeather.city}
          </p>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold">{mockWeather.temp}°</span>
            <span className="text-blue-200 mb-1 text-sm">C</span>
          </div>
          <p className="text-blue-200 text-sm">{mockWeather.condition}</p>
        </div>
        <WeatherIcon />
      </div>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="flex flex-col items-center bg-white/10 rounded-lg p-2">
          <Thermometer className="w-4 h-4 text-blue-300 mb-1" />
          <span className="text-xs text-blue-200">Ndjesia</span>
          <span className="text-sm font-semibold">{mockWeather.feelsLike}°</span>
        </div>
        <div className="flex flex-col items-center bg-white/10 rounded-lg p-2">
          <Droplets className="w-4 h-4 text-blue-300 mb-1" />
          <span className="text-xs text-blue-200">Lagësia</span>
          <span className="text-sm font-semibold">{mockWeather.humidity}%</span>
        </div>
        <div className="flex flex-col items-center bg-white/10 rounded-lg p-2">
          <Wind className="w-4 h-4 text-blue-300 mb-1" />
          <span className="text-xs text-blue-200">Era</span>
          <span className="text-sm font-semibold">{mockWeather.wind} km/h</span>
        </div>
      </div>
    </div>
  );
}
