export type MediaType = 'movie' | 'tv';

export interface CastMember {
  name: string;
  character: string;
  profile_path: string | null;
}

export interface Title {
  id: number;
  media_type: MediaType;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genres: string[];
  genre_ids: number[];
  runtime: number;
  tagline: string;
  cast: CastMember[];
  trailer_key: string;
  number_of_seasons?: number;
}

export type SortKey = 'popularity' | 'rating' | 'year' | 'title';
