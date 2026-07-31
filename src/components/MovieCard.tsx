import { Link } from 'react-router-dom';
import { Bookmark, BookmarkCheck, Play, Star } from 'lucide-react';
import type { Title } from '../types';
import { poster } from '../lib/images';
import { yearOf } from '../lib/format';
import { useWatchlist } from '../context/WatchlistContext';

interface Props {
  title: Title;
  className?: string;
}

export default function MovieCard({ title, className = '' }: Props) {
  const { has, toggle } = useWatchlist();
  const saved = has(title.id);

  return (
    <div className={`group relative ${className}`}>
      <Link to={`/${title.media_type}/${title.id}`} className="block">
        <div className="card-hover relative aspect-[2/3] overflow-hidden rounded-xl border border-white/10 bg-ink-850 shadow-lg shadow-black/40 group-hover:-translate-y-1 group-hover:border-white/25 group-hover:shadow-xl group-hover:shadow-black/60">
          <img
            src={poster(title.poster_path)}
            alt={title.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* hover overlay */}
          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/20 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="mb-2 inline-flex w-fit items-center gap-1 rounded-full bg-accent-gradient px-2.5 py-1 text-xs font-semibold text-black">
              <Play className="h-3 w-3 fill-black" /> Details
            </div>
            <p className="line-clamp-3 text-xs leading-relaxed text-white/80">{title.overview}</p>
          </div>
          {/* rating badge */}
          <div className="absolute left-2 top-2 flex items-center gap-1 rounded-md bg-black/70 px-1.5 py-0.5 text-xs font-semibold backdrop-blur">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="tabular-nums">{title.vote_average.toFixed(1)}</span>
          </div>
        </div>
      </Link>

      <button
        onClick={() => toggle(title)}
        aria-label={saved ? 'Remove from watchlist' : 'Add to watchlist'}
        className={`absolute right-2 top-2 rounded-md p-1.5 backdrop-blur transition ${
          saved ? 'bg-accent-gradient text-black' : 'bg-black/70 text-white/80 hover:text-white'
        } opacity-0 group-hover:opacity-100 focus:opacity-100`}
      >
        {saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
      </button>

      <div className="mt-2 px-0.5">
        <Link
          to={`/${title.media_type}/${title.id}`}
          className="line-clamp-1 text-sm font-semibold text-white/90 transition-colors hover:text-white"
        >
          {title.title}
        </Link>
        <div className="mt-0.5 flex items-center gap-2 text-xs text-white/45">
          <span>{yearOf(title.release_date)}</span>
          <span className="h-1 w-1 rounded-full bg-white/25" />
          <span className="line-clamp-1">{title.genres[0] ?? title.media_type.toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
}
