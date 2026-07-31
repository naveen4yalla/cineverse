// Common TMDB genre ids -> names (movie + tv merged for display purposes).
export const GENRE_MAP: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
  10759: 'Action & Adventure',
  10765: 'Sci-Fi & Fantasy',
  10768: 'War & Politics',
};

// Curated rails shown on the Home / Discover pages.
export const FEATURED_GENRES = [
  'Action',
  'Science Fiction',
  'Adventure',
  'Drama',
  'Crime',
  'Fantasy',
  'Animation',
  'Thriller',
];
