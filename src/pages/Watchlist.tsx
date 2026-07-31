import { Link } from 'react-router-dom';
import { Bookmark, Trash2 } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import { useWatchlist } from '../context/WatchlistContext';

export default function Watchlist() {
  const { items, clear } = useWatchlist();

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-8">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2 text-white/40">
            <Bookmark className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Saved</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
            My <span className="text-gradient">Watchlist</span>
          </h1>
          <p className="mt-1 text-sm text-white/50">
            {items.length} title{items.length === 1 ? '' : 's'} saved · stored locally in your browser
          </p>
        </div>
        {items.length > 0 && (
          <button
            onClick={clear}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/60 transition hover:border-rose-400/40 hover:text-rose-300"
          >
            <Trash2 className="h-3.5 w-3.5" /> Clear all
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 py-24 text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-accent-soft">
            <Bookmark className="h-6 w-6 text-white/70" />
          </div>
          <p className="text-lg font-semibold">Your watchlist is empty</p>
          <p className="mt-1 text-sm text-white/50">Tap the bookmark on any title to save it for later.</p>
          <Link
            to="/discover"
            className="mt-6 inline-block rounded-full bg-accent-gradient px-5 py-2.5 text-sm font-bold text-black transition hover:opacity-90"
          >
            Browse titles
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {items.map((t) => (
            <MovieCard key={`${t.media_type}-${t.id}`} title={t} />
          ))}
        </div>
      )}
    </div>
  );
}
