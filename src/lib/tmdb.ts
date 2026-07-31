import type { CastMember, MediaType, Title } from '../types';
import { GENRE_MAP } from './genres';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY as string | undefined;
const BASE = 'https://api.themoviedb.org/3';

export const LIVE_MODE = Boolean(API_KEY);

function mapItem(d: any, media: MediaType): Title {
  return {
    id: d.id,
    media_type: media,
    title: media === 'movie' ? d.title ?? d.original_title ?? '' : d.name ?? d.original_name ?? '',
    overview: d.overview ?? '',
    poster_path: d.poster_path ?? null,
    backdrop_path: d.backdrop_path ?? null,
    release_date: (media === 'movie' ? d.release_date : d.first_air_date) ?? '',
    vote_average: Math.round((d.vote_average ?? 0) * 10) / 10,
    vote_count: d.vote_count ?? 0,
    genres: d.genres
      ? d.genres.map((g: any) => g.name)
      : (d.genre_ids ?? []).map((id: number) => GENRE_MAP[id]).filter(Boolean),
    genre_ids: d.genres ? d.genres.map((g: any) => g.id) : d.genre_ids ?? [],
    runtime: media === 'movie' ? d.runtime ?? 0 : d.episode_run_time?.[0] ?? 0,
    tagline: d.tagline ?? '',
    cast: (d.credits?.cast ?? []).slice(0, 8).map(
      (c: any): CastMember => ({ name: c.name, character: c.character, profile_path: c.profile_path }),
    ),
    trailer_key:
      (d.videos?.results ?? []).find((v: any) => v.site === 'YouTube' && v.type === 'Trailer')?.key ??
      (d.videos?.results ?? []).find((v: any) => v.site === 'YouTube')?.key ??
      '',
    number_of_seasons: d.number_of_seasons,
  };
}

async function get(path: string, params: Record<string, string> = {}) {
  const url = new URL(`${BASE}${path}`);
  url.searchParams.set('api_key', API_KEY as string);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`TMDB ${res.status}`);
  return res.json();
}

export async function liveList(path: string, media: MediaType): Promise<Title[]> {
  const data = await get(path);
  return (data.results ?? []).map((d: any) => mapItem(d, media));
}

export async function liveDetail(id: number, media: MediaType): Promise<Title> {
  const data = await get(`/${media}/${id}`, { append_to_response: 'credits,videos' });
  return mapItem(data, media);
}

export async function liveSimilar(id: number, media: MediaType): Promise<Title[]> {
  const data = await get(`/${media}/${id}/recommendations`);
  return (data.results ?? []).map((d: any) => mapItem(d, media));
}

export async function liveSearch(query: string, media: MediaType): Promise<Title[]> {
  const data = await get(`/search/${media}`, { query });
  return (data.results ?? []).map((d: any) => mapItem(d, media));
}

export async function liveDiscover(media: MediaType, genreId?: number, sort = 'popularity.desc'): Promise<Title[]> {
  const params: Record<string, string> = { sort_by: sort, 'vote_count.gte': '200' };
  if (genreId) params.with_genres = String(genreId);
  const data = await get(`/discover/${media}`, params);
  return (data.results ?? []).map((d: any) => mapItem(d, media));
}
