import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Title } from '../types';
import MovieCard from './MovieCard';
import { RailSkeleton } from './Skeleton';

interface Props {
  title: string;
  items: Title[];
  loading?: boolean;
  viewAllTo?: string;
}

export default function Rail({ title, items, loading, viewAllTo }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.85), behavior: 'smooth' });
  };

  if (!loading && items.length === 0) return null;

  return (
    <section className="group/rail py-4">
      <div className="mb-3 flex items-end justify-between px-4 sm:px-8">
        <h2 className="text-lg font-bold tracking-tight sm:text-xl">
          <span className="text-gradient">{title}</span>
        </h2>
        <div className="flex items-center gap-2">
          {viewAllTo && (
            <Link to={viewAllTo} className="text-xs font-medium text-white/50 transition-colors hover:text-white">
              View all
            </Link>
          )}
          <div className="hidden gap-1 sm:flex">
            <button
              onClick={() => scroll(-1)}
              aria-label="Scroll left"
              className="rounded-full border border-white/10 bg-white/5 p-1.5 text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scroll(1)}
              aria-label="Scroll right"
              className="rounded-full border border-white/10 bg-white/5 p-1.5 text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <RailSkeleton />
      ) : (
        <div
          ref={ref}
          className="no-scrollbar flex snap-x gap-4 overflow-x-auto scroll-pl-4 px-4 pb-2 sm:scroll-pl-8 sm:px-8"
        >
          {items.map((t) => (
            <div key={`${t.media_type}-${t.id}`} className="w-[150px] shrink-0 snap-start sm:w-[170px]">
              <MovieCard title={t} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
