import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import { GridSkeleton } from '../components/Skeleton';
import { useMedia } from '../context/MediaContext';
import { search } from '../lib/api';
import type { Title } from '../types';

export default function Search() {
  const [params, setParams] = useSearchParams();
  const { media } = useMedia();
  const [q, setQ] = useState(params.get('q') ?? '');
  const [debounced, setDebounced] = useState(q);
  const [results, setResults] = useState<Title[]>([]);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);

  // debounce input
  useEffect(() => {
    const t = setTimeout(() => setDebounced(q), 300);
    return () => clearTimeout(t);
  }, [q]);

  // keep URL in sync
  useEffect(() => {
    setParams(debounced ? { q: debounced } : {}, { replace: true });
  }, [debounced, setParams]);

  useEffect(() => {
    let active = true;
    if (!debounced.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setTouched(true);
    search(debounced, media)
      .then((r) => active && setResults(r))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [debounced, media]);

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-8">
      <h1 className="mb-5 text-3xl font-black tracking-tight sm:text-4xl">
        <span className="text-gradient">Search</span>
      </h1>

      <div className="relative mb-8 max-w-2xl">
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={`Search ${media === 'movie' ? 'movies' : 'TV shows'}, genres, cast…`}
          className="w-full rounded-2xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-4 text-base text-white placeholder:text-white/35 outline-none transition focus:border-white/25 focus:bg-white/10"
        />
      </div>

      {loading ? (
        <GridSkeleton count={12} />
      ) : results.length > 0 ? (
        <>
          <p className="mb-4 text-sm text-white/50">
            {results.length} result{results.length === 1 ? '' : 's'} for “{debounced}”
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {results.map((t) => (
              <MovieCard key={`${t.media_type}-${t.id}`} title={t} />
            ))}
          </div>
        </>
      ) : touched && debounced.trim() ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 py-20 text-center">
          <p className="text-lg font-semibold">No matches for “{debounced}”</p>
          <p className="mt-1 text-sm text-white/50">Check the spelling or try another title.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/5 py-20 text-center">
          <p className="text-lg font-semibold">Start typing to search</p>
          <p className="mt-1 text-sm text-white/50">Find titles by name, genre, or cast member.</p>
        </div>
      )}
    </div>
  );
}
