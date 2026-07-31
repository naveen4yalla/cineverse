import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, BookmarkCheck, Info, Play, Star } from 'lucide-react';
import type { Title } from '../types';
import { backdrop } from '../lib/images';
import { yearOf, runtimeLabel } from '../lib/format';
import { useWatchlist } from '../context/WatchlistContext';
import { Shimmer } from './Skeleton';

interface Props {
  items: Title[];
  loading?: boolean;
}

export default function HeroCarousel({ items, loading }: Props) {
  const [idx, setIdx] = useState(0);
  const { has, toggle } = useWatchlist();
  const slides = items.slice(0, 5);

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [slides.length]);

  if (loading || slides.length === 0) {
    return <Shimmer className="h-[62vh] min-h-[420px] w-full sm:h-[72vh]" />;
  }

  const active = slides[idx];
  const saved = has(active.id);

  return (
    <div className="relative h-[62vh] min-h-[440px] w-full overflow-hidden sm:h-[74vh]">
      {slides.map((s, i) => (
        <img
          key={s.id}
          src={backdrop(s.backdrop_path)}
          alt=""
          aria-hidden={i !== idx}
          className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-1000 ${
            i === idx ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}

      {/* gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink-950/95 via-ink-950/50 to-transparent" />

      <div className="absolute inset-0 flex items-end sm:items-center">
        <div className="w-full max-w-2xl px-4 pb-10 sm:px-8 sm:pb-0 lg:px-14" key={active.id}>
          <div className="animate-fade-up">
            <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-semibold">
              <span className="rounded-full bg-accent-gradient px-2.5 py-1 text-black">
                #{idx + 1} Trending
              </span>
              <span className="flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 backdrop-blur">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span className="tabular-nums">{active.vote_average.toFixed(1)}</span>
              </span>
              <span className="rounded-full bg-white/10 px-2.5 py-1 backdrop-blur">{yearOf(active.release_date)}</span>
              {active.runtime > 0 && (
                <span className="rounded-full bg-white/10 px-2.5 py-1 backdrop-blur">{runtimeLabel(active.runtime)}</span>
              )}
            </div>

            <h1 className="text-4xl font-black leading-none tracking-tight drop-shadow-lg sm:text-6xl">
              {active.title}
            </h1>

            {active.tagline && (
              <p className="mt-3 text-sm italic text-white/60 sm:text-base">“{active.tagline}”</p>
            )}

            <p className="mt-3 line-clamp-3 max-w-xl text-sm text-white/75 sm:text-base">{active.overview}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {active.genres.slice(0, 3).map((g) => (
                <span key={g} className="rounded-full border border-white/15 px-2.5 py-0.5 text-xs text-white/70">
                  {g}
                </span>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                to={`/${active.media_type}/${active.id}`}
                className="inline-flex items-center gap-2 rounded-full bg-accent-gradient px-5 py-2.5 text-sm font-bold text-black transition hover:opacity-90"
              >
                <Play className="h-4 w-4 fill-black" /> Watch details
              </Link>
              <button
                onClick={() => toggle(active)}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                {saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                {saved ? 'In watchlist' : 'Watchlist'}
              </button>
              <Link
                to={`/${active.media_type}/${active.id}`}
                aria-label="More info"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 p-2.5 text-white/80 backdrop-blur transition hover:bg-white/15"
              >
                <Info className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* dots */}
      <div className="absolute bottom-4 left-4 flex gap-2 sm:left-8">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === idx ? 'w-7 bg-accent-gradient' : 'w-3 bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
