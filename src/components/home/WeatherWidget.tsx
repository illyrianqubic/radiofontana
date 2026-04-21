import { Cloud, Sun, CloudRain, Thermometer, Wind, Droplets } from 'lucide-react';

const mockWeather = {
  city: 'Istog',
  country: 'Kosovë',
  temp: 18,
  feelsLike: 16,
  condition: 'Pjesërisht me re',
  humidity: 62,
  wind: 12,
  icon: 'partly-cloudy',
};

export default function WeatherWidget() {
  const weatherIcon =
    mockWeather.icon === 'sunny' ? (
      <Sun className="w-10 h-10 sm:w-12 sm:h-12 text-amber-400" />
    ) : mockWeather.icon === 'rainy' ? (
      <CloudRain className="w-10 h-10 sm:w-12 sm:h-12 text-blue-400" />
    ) : (
      <Cloud className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300" />
    );

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      {/* Time header */}
      <div className="px-4 sm:px-5 pt-4 sm:pt-5 pb-4">
        <div className="flex items-baseline justify-between gap-3 mb-1">
          <p className="text-xl sm:text-3xl font-bold tracking-tight text-slate-800">Moti Aktual</p>
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#e63946]">Istog</span>
        </div>
        <p className="text-slate-400 text-xs sm:text-sm">Parashikimi për sot</p>
      </div>

      {/* Divider */}
      <div className="mx-4 sm:mx-5 h-px bg-slate-100" />

      {/* Weather body */}
      <div className="px-4 sm:px-5 py-4">
        <div className="flex items-start sm:items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400 mb-1.5">
              {mockWeather.city}, {mockWeather.country}
            </p>
            <div className="flex items-end gap-1">
              <span className="text-3xl sm:text-4xl font-bold text-slate-800 tracking-tight">{mockWeather.temp}°</span>
              <span className="text-slate-400 mb-1.5 text-sm font-medium">C</span>
            </div>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">{mockWeather.condition}</p>
          </div>
          {weatherIcon}
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
