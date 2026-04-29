'use client';

import { createContext, useContext, useRef, useState, useEffect, useCallback, ReactNode } from 'react';

const DEFAULT_STREAM_URL = 'https://live.radiostreaming.al:8010/stream.mp3';

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

export function AudioPlayerProvider({
  children,
  streamUrl,
}: {
  children: ReactNode;
  /** Optional override coming from siteSettings (audit P3-L10). */
  streamUrl?: string;
}) {
  const STREAM_URL = streamUrl || DEFAULT_STREAM_URL;
  const streamUrlRef = useRef(STREAM_URL);
  streamUrlRef.current = STREAM_URL;
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [volume, setVolumeState] = useState(0.8);
  const [muted, setMutedState] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const wantPlayRef = useRef(false);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'none';
    audio.volume = 0.8;
    audioRef.current = audio;

    const onWaiting = () => setLoading(true);
    const onPlaying = () => {
      setLoading(false);
      setPlaying(true);
      setError(false);
    };
    const onPause = () => {
      setPlaying(false);
    };
    // 'stalled' fires constantly on Shoutcast ICY streams — NOT an error, ignore it
    // 'suspend' is also normal on live streams, ignore it too
    const onError = () => {
      if (!wantPlayRef.current) return;
      setLoading(false);
      setPlaying(false);
      setError(true);
    };
    // Shoutcast closes TCP connections periodically; reconnect automatically
    const onEnded = () => {
      if (!wantPlayRef.current) return;
      setPlaying(false);
      setLoading(true);
      setTimeout(() => {
        const a = audioRef.current;
        if (a && wantPlayRef.current) {
          a.src = streamUrlRef.current;
          a.load();
          a.play().catch(() => {
            setLoading(false);
            setError(true);
          });
        }
      }, 1500);
    };

    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('error', onError);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('error', onError);
      audio.removeEventListener('ended', onEnded);
      wantPlayRef.current = false;
      audio.pause();
      audio.src = '';
      audio.load();
      audioRef.current = null;
    };
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
      wantPlayRef.current = false;
      audio.pause();
      audio.src = '';
      setLoading(false);
      setPlaying(false);
      setError(false);
    } else {
      wantPlayRef.current = true;
      setError(false);
      setLoading(true);
      audio.src = streamUrlRef.current;
      audio.volume = muted ? 0 : volume;
      audio.load();
      audio.play().catch(() => {
        setLoading(false);
        setPlaying(false);
        setError(true);
      });
    }
  }, [playing, loading, volume, muted]);

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
