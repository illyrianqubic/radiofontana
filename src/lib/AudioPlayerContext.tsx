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
  const shouldPlayRef = useRef(false);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startStream = useCallback((audio: HTMLAudioElement, vol: number, mut: boolean) => {
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
    audio.src = `${STREAM_URL}?_t=${Date.now()}`;
    audio.volume = mut ? 0 : vol;
    setError(false);
    setLoading(true);
    audio.play().catch(() => {
      if (shouldPlayRef.current) {
        setLoading(false);
        setError(true);
      }
    });
  }, []);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'none';
    audio.volume = 0.8;
    audioRef.current = audio;

    const onWaiting = () => { if (shouldPlayRef.current) setLoading(true); };
    const onPlaying = () => { setLoading(false); setPlaying(true); setError(false); };
    const onPause = () => { if (!shouldPlayRef.current) setPlaying(false); };

    // 'ended' fires when Shoutcast closes the TCP connection — auto-reconnect
    const onEnded = () => {
      if (shouldPlayRef.current) {
        setPlaying(false);
        setLoading(true);
        retryTimerRef.current = setTimeout(() => startStream(audio, audio.volume, false), 1500);
      }
    };

    // 'stalled' is a false-positive on live streams — don't treat as error, just re-attempt
    const onStalled = () => {
      if (shouldPlayRef.current) {
        setLoading(true);
      }
    };

    const onError = () => {
      if (shouldPlayRef.current) {
        setLoading(false);
        setPlaying(false);
        setError(true);
        // Retry once after 3 s on a real network error
        retryTimerRef.current = setTimeout(() => {
          if (shouldPlayRef.current) {
            startStream(audio, audio.volume, false);
          }
        }, 3000);
      }
    };

    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('stalled', onStalled);
    audio.addEventListener('error', onError);

    return () => {
      shouldPlayRef.current = false;
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
      audio.pause();
      audio.src = '';
    };
  }, [startStream]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume;
    }
  }, [volume, muted]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (shouldPlayRef.current) {
      // Stop
      shouldPlayRef.current = false;
      if (retryTimerRef.current) { clearTimeout(retryTimerRef.current); retryTimerRef.current = null; }
      audio.pause();
      audio.src = '';
      setLoading(false);
      setPlaying(false);
      setError(false);
    } else {
      // Start
      shouldPlayRef.current = true;
      startStream(audio, volume, muted);
    }
  }, [volume, muted, startStream]);

  const setVolume = useCallback((v: number) => {
    const nextVolume = Math.max(0, Math.min(1, v));
    const shouldMute = nextVolume === 0;
    setVolumeState(nextVolume);
    setMutedState(shouldMute);
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
