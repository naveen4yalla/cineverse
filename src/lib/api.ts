import type { MediaType, SortKey, Title } from '../types';
import { MOCK_TITLES } from '../data/movies';
import {
  LIVE_MODE,
  liveDetail,
  liveDiscover,
  liveList,
  liveSearch,
  liveSimilar,
} from './tmdb';

export { LIVE_MODE };

// Small artificial latency in mock mode so skeleton loaders are visible / realistic.
const delay = (ms = 320) => new Promise((r) => setTimeout(r, ms));

function ofMedia(media: MediaType): Title[] {
  return MOCK_TITLES.filter((t) => t.media_type === media);
}

function year(t: Title): number {
  return t.release_date ? Number(t.release_date.slice(0, 4)) : 0;
}

// Deterministic "popularity" so mock rails feel curated but stable.
function popularity(t: Title): number {
  return t.vote_count * 0.7 + t.vote_average * 5000;
}

export async function getTrending(media: MediaType): Promise<Title[]> {
  if (LIVE_MODE) return liveList(`/trending/${media}/week`, media);
  await delay();
  return [...ofMedia(media)].sort((a, b) => popularity(b) - popularity(a)).slice(0, 8);
}

export async function getPopular(media: MediaType): Promise<Title[]> {
  if (LIVE_MODE) return liveList(`/${media}/popular`, media);
  await delay();
  return [...ofMedia(media)].sort((a, b) => b.vote_count - a.vote_count);
}

export async function getTopRated(media: MediaType): Promise<Title[]> {
  if (LIVE_MODE) return liveList(`/${media}/top_rated`, media);
  await delay();
  return [...ofMedia(media)].sort((a, b) => b.vote_average - a.vote_average);
}

export async function getNowPlaying(media: MediaType): Promise<Title[]> {
  if (LIVE_MODE) return liveList(media === 'movie' ? '/movie/now_playing' : '/tv/on_the_air', media);
  await delay();
  return [...ofMedia(media)].sort((a, b) => year(b) - year(a));
}

export async function getByGenre(media: MediaType, genre: string): Promise<Title[]> {
  if (LIVE_MODE) {
    // find id from any mock title carrying this genre for a best-effort live call
    return liveDiscoverByGenreName(media, genre);
  }
  await delay();
  return ofMedia(media)
    .filter((t) => t.genres.includes(genre))
    .sort((a, b) => popularity(b) - popularity(a));
}

async function liveDiscoverByGenreName(media: MediaType, genre: string): Promise<Title[]> {
  const sample = MOCK_TITLES.find((t) => t.genres.includes(genre));
  const gid = sample ? sample.genre_ids[sample.genres.indexOf(genre)] : undefined;
  return liveDiscover(media, gid);
}

export async function getById(id: number, media: MediaType): Promise<Title | undefined> {
  if (LIVE_MODE) {
    try {
      return await liveDetail(id, media);
    } catch {
      return MOCK_TITLES.find((t) => t.id === id);
    }
  }
  await delay(220);
  return MOCK_TITLES.find((t) => t.id === id);
}

export async function getSimilar(title: Title): Promise<Title[]> {
  if (LIVE_MODE) {
    try {
      const res = await liveSimilar(title.id, title.media_type);
      if (res.length) return res.slice(0, 12);
    } catch {
      /* fall through to mock */
    }
  }
  await delay(180);
  return ofMedia(title.media_type)
    .filter((t) => t.id !== title.id)
    .map((t) => ({
      t,
      score: t.genres.filter((g) => title.genres.includes(g)).length,
    }))
    .sort((a, b) => b.score - a.score || popularity(b.t) - popularity(a.t))
    .slice(0, 12)
    .map((x) => x.t);
}

export async function search(query: string, media: MediaType): Promise<Title[]> {
  const q = query.trim();
  if (!q) return [];
  if (LIVE_MODE) return liveSearch(q, media);
  await delay(160);
  const lc = q.toLowerCase();
  return ofMedia(media)
    .filter(
      (t) =>
        t.title.toLowerCase().includes(lc) ||
        t.overview.toLowerCase().includes(lc) ||
        t.genres.some((g) => g.toLowerCase().includes(lc)) ||
        t.cast.some((c) => c.name.toLowerCase().includes(lc)),
    )
    .sort((a, b) => popularity(b) - popularity(a));
}

export interface DiscoverOpts {
  media: MediaType;
  genre?: string;
  sort: SortKey;
}

export async function discover({ media, genre, sort }: DiscoverOpts): Promise<Title[]> {
  let list: Title[];
  if (LIVE_MODE) {
    const sortMap: Record<SortKey, string> = {
      popularity: 'popularity.desc',
      rating: 'vote_average.desc',
      year: media === 'movie' ? 'primary_release_date.desc' : 'first_air_date.desc',
      title: 'original_title.asc',
    };
    const sample = genre ? MOCK_TITLES.find((t) => t.genres.includes(genre)) : undefined;
    const gid = sample ? sample.genre_ids[sample.genres.indexOf(genre!)] : undefined;
    list = await liveDiscover(media, gid, sortMap[sort]);
  } else {
    await delay(200);
    list = ofMedia(media).filter((t) => !genre || t.genres.includes(genre));
  }
  return sortTitles(list, sort);
}

export function sortTitles(list: Title[], sort: SortKey): Title[] {
  const arr = [...list];
  switch (sort) {
    case 'rating':
      return arr.sort((a, b) => b.vote_average - a.vote_average);
    case 'year':
      return arr.sort((a, b) => year(b) - year(a));
    case 'title':
      return arr.sort((a, b) => a.title.localeCompare(b.title));
    default:
      return arr.sort((a, b) => popularity(b) - popularity(a));
  }
}

export function allGenres(media: MediaType): string[] {
  const set = new Set<string>();
  ofMedia(media).forEach((t) => t.genres.forEach((g) => set.add(g)));
  return [...set].sort();
}
