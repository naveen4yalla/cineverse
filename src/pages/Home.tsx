import HeroCarousel from '../components/HeroCarousel';
import Rail from '../components/Rail';
import { useMedia } from '../context/MediaContext';
import { getByGenre, getNowPlaying, getPopular, getTopRated, getTrending } from '../lib/api';
import { FEATURED_GENRES } from '../lib/genres';
import { useAsync } from '../lib/useAsync';
import type { Title } from '../types';

export default function Home() {
  const { media } = useMedia();

  const trending = useAsync<Title[]>(() => getTrending(media), [media], []);
  const popular = useAsync<Title[]>(() => getPopular(media), [media], []);
  const topRated = useAsync<Title[]>(() => getTopRated(media), [media], []);
  const nowPlaying = useAsync<Title[]>(() => getNowPlaying(media), [media], []);

  const g0 = useAsync<Title[]>(() => getByGenre(media, FEATURED_GENRES[0]), [media], []);
  const g1 = useAsync<Title[]>(() => getByGenre(media, FEATURED_GENRES[1]), [media], []);
  const g2 = useAsync<Title[]>(() => getByGenre(media, FEATURED_GENRES[4]), [media], []);
  const g3 = useAsync<Title[]>(() => getByGenre(media, FEATURED_GENRES[5]), [media], []);

  return (
    <div className="pb-8">
      <HeroCarousel items={trending.data} loading={trending.loading} />

      <div className="mx-auto max-w-[1600px]">
        <Rail title="Trending Now" items={trending.data} loading={trending.loading} viewAllTo="/discover?sort=popularity" />
        <Rail title="Popular" items={popular.data} loading={popular.loading} viewAllTo="/discover?sort=popularity" />
        <Rail title="Top Rated" items={topRated.data} loading={topRated.loading} viewAllTo="/discover?sort=rating" />
        <Rail
          title={media === 'movie' ? 'Now Playing' : 'On The Air'}
          items={nowPlaying.data}
          loading={nowPlaying.loading}
          viewAllTo="/discover?sort=year"
        />
        <Rail title={FEATURED_GENRES[0]} items={g0.data} loading={g0.loading} viewAllTo={`/discover?genre=${encodeURIComponent(FEATURED_GENRES[0])}`} />
        <Rail title={FEATURED_GENRES[1]} items={g1.data} loading={g1.loading} viewAllTo={`/discover?genre=${encodeURIComponent(FEATURED_GENRES[1])}`} />
        <Rail title={FEATURED_GENRES[4]} items={g2.data} loading={g2.loading} viewAllTo={`/discover?genre=${encodeURIComponent(FEATURED_GENRES[4])}`} />
        <Rail title={FEATURED_GENRES[5]} items={g3.data} loading={g3.loading} viewAllTo={`/discover?genre=${encodeURIComponent(FEATURED_GENRES[5])}`} />
      </div>
    </div>
  );
}
