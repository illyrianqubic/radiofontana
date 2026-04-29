'use client';

import { useEffect, useState } from 'react';
import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Snowflake,
  Sun,
  Wind,
} from 'lucide-react';

// Istog, Kosovo
const LAT = 42.78;
const LON = 20.48;
const ENDPOINT = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,weathercode,windspeed_10m&timezone=Europe%2FBelgrade`;

interface CurrentWeather {
  temperature: number;
  windspeed: number;
  weathercode: number;
}

interface OpenMeteoResponse {
  current?: {
    temperature_2m?: number;
    weathercode?: number;
    windspeed_10m?: number;
  };
}

// WMO weather code → Albanian label + icon picker
function describe(code: number): { label: string; Icon: typeof Sun } {
  if (code === 0) return { label: 'Me diell', Icon: Sun };
  if (code === 1 || code === 2) return { label: 'Pjesërisht me re', Icon: CloudSun };
  if (code === 3) return { label: 'Me re', Icon: Cloud };
  if (code === 45 || code === 48) return { label: 'Mjegull', Icon: CloudFog };
  if (code >= 51 && code <= 57) return { label: 'Shi i lehtë', Icon: CloudDrizzle };
  if (code >= 61 && code <= 67) return { label: 'Shi', Icon: CloudRain };
  if (code >= 71 && code <= 77) return { label: 'Borë', Icon: CloudSnow };
  if (code >= 80 && code <= 82) return { label: 'Reshje', Icon: CloudRain };
  if (code === 85 || code === 86) return { label: 'Reshje bore', Icon: Snowflake };
  if (code >= 95) return { label: 'Stuhi', Icon: CloudLightning };
  return { label: 'Me re', Icon: Cloud };
}

export default function WeatherWidget() {
  const [data, setData] = useState<CurrentWeather | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const ctrl = new AbortController();
    const timeout = setTimeout(() => ctrl.abort(), 8000);

    fetch(ENDPOINT, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((json: OpenMeteoResponse) => {
        const c = json.current;
        if (
          !c ||
          typeof c.temperature_2m !== 'number' ||
          typeof c.weathercode !== 'number'
        ) {
          throw new Error('bad payload');
        }
        setData({
          temperature: c.temperature_2m,
          windspeed: c.windspeed_10m ?? 0,
          weathercode: c.weathercode,
        });
      })
      .catch(() => setError(true))
      .finally(() => clearTimeout(timeout));

    return () => {
      ctrl.abort();
      clearTimeout(timeout);
    };
  }, []);

  return (
    <aside
      className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden"
      aria-label="Moti në Istog"
    >
      <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
        <span className="w-1.5 h-5 bg-red-600 rounded-full" aria-hidden="true" />
        <h3 className="text-sm font-extrabold uppercase tracking-[0.14em] text-slate-900">
          Moti në Istog
        </h3>
      </div>

      <div className="px-4 py-4">
        {error || !data ? (
          <WeatherSkeleton failed={error} />
        ) : (
          <WeatherBody data={data} />
        )}
      </div>
    </aside>
  );
}

function WeatherBody({ data }: { data: CurrentWeather }) {
  const { label, Icon } = describe(data.weathercode);
  return (
    <div className="flex items-center gap-4">
      <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center text-red-600">
        <Icon className="w-8 h-8" strokeWidth={1.6} aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-1.5 leading-none">
          <span className="text-3xl font-black text-slate-900 tabular-nums">
            {Math.round(data.temperature)}
          </span>
          <span className="text-lg font-bold text-slate-500">°C</span>
        </div>
        <p className="mt-1 text-sm font-semibold text-slate-700 truncate">{label}</p>
        <p className="mt-1 inline-flex items-center gap-1 text-xs text-slate-500">
          <Wind className="w-3.5 h-3.5" aria-hidden="true" />
          <span className="tabular-nums">{Math.round(data.windspeed)}</span> km/h erë
        </p>
      </div>
    </div>
  );
}

function WeatherSkeleton({ failed }: { failed: boolean }) {
  if (failed) {
    return (
      <p className="text-sm text-slate-500">
        Të dhënat e motit nuk janë në dispozicion për momentin.
      </p>
    );
  }
  return (
    <div className="flex items-center gap-4 animate-pulse" aria-hidden="true">
      <div className="w-14 h-14 rounded-2xl bg-slate-100" />
      <div className="flex-1 space-y-2">
        <div className="h-7 w-20 bg-slate-100 rounded" />
        <div className="h-3 w-28 bg-slate-100 rounded" />
        <div className="h-3 w-20 bg-slate-100 rounded" />
      </div>
    </div>
  );
}
