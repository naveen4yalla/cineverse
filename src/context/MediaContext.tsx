import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { MediaType } from '../types';

interface MediaValue {
  media: MediaType;
  setMedia: (m: MediaType) => void;
}

const MediaContext = createContext<MediaValue | null>(null);

export function MediaProvider({ children }: { children: ReactNode }) {
  const [media, setMedia] = useState<MediaType>('movie');
  const value = useMemo(() => ({ media, setMedia }), [media]);
  return <MediaContext.Provider value={value}>{children}</MediaContext.Provider>;
}

export function useMedia(): MediaValue {
  const ctx = useContext(MediaContext);
  if (!ctx) throw new Error('useMedia must be used within MediaProvider');
  return ctx;
}
