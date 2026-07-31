import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Bookmark, BookmarkCheck, Calendar, Clock, Play, Star, Tv } from 'lucide-react';
import type { MediaType, Title } from '../types';
import { getById, getSimilar } from '../lib/api';
import { useAsync } from '../lib/useAsync';
import { backdrop, poster, profile } from '../lib/images';
import { compact, runtimeLabel, yearOf } from '../lib/format';
import { useWatchlist } from '../context/WatchlistContext';
import RatingRing from '../components/RatingRing';
import Rail from '../components/Rail';
import { Shimmer } from '../components/Skeleton';

export default function Detail() {
  const { media, id } = useParams<{ media: MediaType; id: string }>();
  const numId = Number(id);
  const mediaType = (media as MediaType) || 'movie';
  const { has, toggle } = useWatchlist();

  const { data: title, loading } = useAsync<Title | undefined>(
    () => getById(numId, mediaType),
    [numId, mediaType],
    undefined,
  );

  const { data: similar, loading: simLoading } = useAsync<Title[]>(
    () => (title ? getSimilar(title) : Promise.resolve([])),
    [title?.id],
    [],
  );

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [numId]);

  if (loading) {
    return (
      <div>
        <Shimmer className="h-[52vh] w-full" />
        <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-8">
          <Shimmer className="h-8 w-1/2 rounded" />
          <Shimmer className="mt-4 h-24 w-full rounded" />
        </div>
      </div>
    );
  }

  if (!title) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Title not found</h1>
        <p className="mt-2 text-white/50">We couldn’t find that title in the catalog.</p>
        <Link to="/" className="mt-6 inline-block rounded-full bg-accent-gradient px-5 py-2 text-sm font-bold text-black">
          Back home
        </Link>
      </div>
    );
  }

  const saved = has(title.id);

  return (
    <div className="pb-8">
      {/* backdrop hero */}
      <div className="relative h-[54vh] min-h-[380px] w-full overflow-hidden">
        <img src={backdrop(title.backdrop_path)} alt="" className="h-full w-full object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950/80 to-transparent" />
        <div className="absolute left-4 top-4 sm:left-8 sm:top-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/40 px-3 py-1.5 text-sm text-white/80 backdrop-blur transition hover:bg-black/60"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
        </div>
      </div>

      {/* main content */}
      <div className="mx-auto -mt-40 max-w-[1600px] px-4 sm:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:gap-8">
          {/* poster */}
          <div className="shrink-0">
            <img
              src={poster(title.poster_path)}
              alt={title.title}
              className="mx-auto w-40 rounded-2xl border border-white/10 shadow-2xl shadow-black/60 sm:mx-0 sm:w-56"
            />
          </div>

          {/* meta */}
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <span className="flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide backdrop-blur">
                {title.media_type === 'tv' ? <Tv className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                {title.media_type === 'tv' ? 'TV Series' : 'Movie'}
              </span>
            </div>

            <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-5xl">{title.title}</h1>
            {title.tagline && <p className="mt-2 text-sm italic text-white/55 sm:text-base">“{title.tagline}”</p>}

            <div className="mt-4 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3">
                <RatingRing value={title.vote_average} />
                <div className="text-xs text-white/50">
                  <div className="font-semibold text-white/70">User Score</div>
                  <div>{compact(title.vote_count)} votes</div>
                </div>
              </div>
              <div className="h-10 w-px bg-white/10" />
              <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-white/70">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-white/40" /> {yearOf(title.release_date)}
                </span>
                {title.media_type === 'tv' ? (
                  <span className="flex items-center gap-1.5">
                    <Tv className="h-4 w-4 text-white/40" /> {title.number_of_seasons ?? '—'} season
                    {title.number_of_seasons === 1 ? '' : 's'}
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-white/40" /> {runtimeLabel(title.runtime)}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> {title.vote_average.toFixed(1)} / 10
                </span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {title.genres.map((g) => (
                <Link
                  key={g}
                  to={`/discover?genre=${encodeURIComponent(g)}`}
                  className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/70 transition hover:border-white/30 hover:text-white"
                >
                  {g}
                </Link>
              ))}
            </div>

            <h2 className="mt-6 text-sm font-bold uppercase tracking-wider text-white/40">Overview</h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-white/80 sm:text-base">
              {title.overview || 'No overview available.'}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {title.trailer_key && (
                <a
                  href={`https://www.youtube.com/watch?v=${title.trailer_key}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-accent-gradient px-5 py-2.5 text-sm font-bold text-black transition hover:opacity-90"
                >
                  <Play className="h-4 w-4 fill-black" /> Watch Trailer
                </a>
              )}
              <button
                onClick={() => toggle(title)}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                {saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                {saved ? 'In Watchlist' : 'Add to Watchlist'}
              </button>
            </div>
          </div>
        </div>

        {/* trailer embed */}
        {title.trailer_key && (
          <div className="mt-10">
            <h2 className="mb-3 text-lg font-bold">
              <span className="text-gradient">Trailer</span>
            </h2>
            <div className="aspect-video w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-black">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${title.trailer_key}`}
                title={`${title.title} trailer`}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* cast */}
        {title.cast.length > 0 && (
          <div className="mt-10">
            <h2 className="mb-3 text-lg font-bold">
              <span className="text-gradient">Top Cast</span>
            </h2>
            <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2">
              {title.cast.map((c) => (
                <div key={c.name} className="w-28 shrink-0 text-center">
                  <img
                    src={profile(c.profile_path)}
                    alt={c.name}
                    loading="lazy"
                    className="mx-auto h-28 w-28 rounded-full border border-white/10 object-cover"
                  />
                  <p className="mt-2 line-clamp-1 text-sm font-semibold">{c.name}</p>
                  <p className="line-clamp-1 text-xs text-white/45">{c.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* more like this */}
      <div className="mx-auto mt-10 max-w-[1600px]">
        <Rail title="More Like This" items={similar} loading={simLoading} />
      </div>
    </div>
  );
}
