import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import { GridSkeleton } from '../components/Skeleton';
import { useMedia } from '../context/MediaContext';
import { allGenres, discover } from '../lib/api';
import { useAsync } from '../lib/useAsync';
import type { SortKey, Title } from '../types';

const SORTS: { key: SortKey; label: string }[] = [
  { key: 'popularity', label: 'Popularity' },
  { key: 'rating', label: 'Rating' },
  { key: 'year', label: 'Newest' },
  { key: 'title', label: 'A–Z' },
];

export default function Discover() {
  const { media } = useMedia();
  const [params, setParams] = useSearchParams();

  const genre = params.get('genre') ?? '';
  const sort = (params.get('sort') as SortKey) || 'popularity';

  const genres = useMemo(() => allGenres(media), [media]);

  const { data, loading } = useAsync<Title[]>(
    () => discover({ media, genre: genre || undefined, sort }),
    [media, genre, sort],
    [],
  );

  const update = (patch: Record<string, string>) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([k, v]) => {
      if (v) next.set(k, v);
      else next.delete(k);
    });
    setParams(next, { replace: true });
  };

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-8">
      <div className="mb-6 flex flex-col gap-1">
        <div className="flex items-center gap-2 text-white/40">
          <SlidersHorizontal className="h-4 w-4" />
          <span className="text-xs font-semibold uppercase tracking-wider">Discover</span>
        </div>
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
          Browse <span className="text-gradient">{media === 'movie' ? 'Movies' : 'TV Shows'}</span>
        </h1>
        <p className="text-sm text-white/50">
          {loading ? 'Loading…' : `${data.length} titles`}
          {genre ? ` in ${genre}` : ''}
        </p>
      </div>

      {/* sort control */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-white/40">Sort</span>
        {SORTS.map((s) => (
          <button
            key={s.key}
            onClick={() => update({ sort: s.key })}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              sort === s.key ? 'bg-accent-gradient text-black' : 'border border-white/10 bg-white/5 text-white/60 hover:text-white'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* genre chips */}
      <div className="no-scrollbar mb-8 flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => update({ genre: '' })}
          className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
            !genre ? 'bg-white/15 text-white' : 'border border-white/10 bg-white/5 text-white/60 hover:text-white'
          }`}
        >
          All genres
        </button>
        {genres.map((g) => (
          <button
            key={g}
            onClick={() => update({ genre: g === genre ? '' : g })}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              g === genre ? 'bg-white/15 text-white' : 'border border-white/10 bg-white/5 text-white/60 hover:text-white'
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      {loading ? (
        <GridSkeleton count={18} />
      ) : data.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 py-20 text-center">
          <p className="text-lg font-semibold">No titles found</p>
          <p className="mt-1 text-sm text-white/50">Try a different genre or sort order.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {data.map((t) => (
            <MovieCard key={`${t.media_type}-${t.id}`} title={t} />
          ))}
        </div>
      )}
    </div>
  );
}
