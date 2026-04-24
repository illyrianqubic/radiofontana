'use client';

import { createContext, useContext, useRef, useState, useEffect, useCallback, ReactNode } from 'react';

const STREAM_URL = 'https://live.radiostreaming.al:8010/stream.mp3';

interface AudioPlayerContextType {
  playing: boolean;
  loading: boolean;
  error: boolean;
  volume: number;
  muted: boolean;
  setVolume: (v: number) => void;
  setMuted: (m: boolean) => void;
  togglePlay: () => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | null>(null);

export function AudioPlayerProvider({ children }: { children: ReactNode }) {
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [volume, setVolumeState] = useState(0.8);
  const [muted, setMutedState] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'none';
    audio.volume = 0.8;
    audioRef.current = audio;

    audio.addEventListener('waiting', () => setLoading(true));
    audio.addEventListener('playing', () => { setLoading(false); setPlaying(true); setError(false); });
    audio.addEventListener('pause', () => setPlaying(false));
    audio.addEventListener('stalled', () => { setLoading(false); setPlaying(false); setError(true); });
    audio.addEventListener('error', () => { setLoading(false); setPlaying(false); setError(true); });

    return () => { audio.pause(); audio.src = ''; };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume;
    }
  }, [volume, muted]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing || loading) {
      audio.pause();
      audio.src = '';
      setLoading(false);
      setPlaying(false);
    } else {
      setError(false);
      setLoading(true);
      audio.src = STREAM_URL;
      audio.load();
      audio.play().catch(() => {
        setLoading(false);
        setPlaying(false);
        setError(true);
      });
    }
  }, [playing, loading]);

  const setVolume = useCallback((v: number) => {
    const nextVolume = Math.max(0, Math.min(1, v));
    const shouldMute = nextVolume === 0;
    setVolumeState(nextVolume);
    setMutedState(shouldMute);

    // Apply immediately for touch sliders that emit events rapidly.
    if (audioRef.current) {
      audioRef.current.volume = shouldMute ? 0 : nextVolume;
    }
  }, []);

  const setMuted = useCallback((m: boolean) => {
    setMutedState(m);

    if (audioRef.current) {
      audioRef.current.volume = m ? 0 : volume;
    }
  }, [volume]);

  return (
    <AudioPlayerContext.Provider value={{ playing, loading, error, volume, muted, setVolume, setMuted, togglePlay }}>
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  const ctx = useContext(AudioPlayerContext);
  if (!ctx) throw new Error('useAudioPlayer must be used within AudioPlayerProvider');
  return ctx;
}
