import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Title } from '../types';

const KEY = 'cineverse:watchlist';

interface WatchlistValue {
  items: Title[];
  ids: Set<number>;
  has: (id: number) => boolean;
  toggle: (t: Title) => void;
  remove: (id: number) => void;
  clear: () => void;
}

const WatchlistContext = createContext<WatchlistValue | null>(null);

function load(): Title[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Title[]) : [];
  } catch {
    return [];
  }
}

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Title[]>(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      /* ignore quota errors */
    }
  }, [items]);

  const ids = useMemo(() => new Set(items.map((t) => t.id)), [items]);

  const has = useCallback((id: number) => ids.has(id), [ids]);

  const toggle = useCallback((t: Title) => {
    setItems((prev) => (prev.some((x) => x.id === t.id) ? prev.filter((x) => x.id !== t.id) : [t, ...prev]));
  }, []);

  const remove = useCallback((id: number) => {
    setItems((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<WatchlistValue>(
    () => ({ items, ids, has, toggle, remove, clear }),
    [items, ids, has, toggle, remove, clear],
  );

  return <WatchlistContext.Provider value={value}>{children}</WatchlistContext.Provider>;
}

export function useWatchlist(): WatchlistValue {
  const ctx = useContext(WatchlistContext);
  if (!ctx) throw new Error('useWatchlist must be used within WatchlistProvider');
  return ctx;
}
