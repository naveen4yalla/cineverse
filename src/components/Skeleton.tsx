export function Shimmer({ className = '' }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-white/5 ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
}

export function PosterSkeleton() {
  return (
    <div className="w-[150px] shrink-0 sm:w-[170px]">
      <Shimmer className="aspect-[2/3] w-full rounded-xl" />
      <Shimmer className="mt-2 h-3 w-3/4 rounded" />
      <Shimmer className="mt-1.5 h-2.5 w-1/3 rounded" />
    </div>
  );
}

export function RailSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="flex gap-4 overflow-hidden px-4 sm:px-8">
      {Array.from({ length: count }).map((_, i) => (
        <PosterSkeleton key={i} />
      ))}
    </div>
  );
}

export function GridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          <Shimmer className="aspect-[2/3] w-full rounded-xl" />
          <Shimmer className="mt-2 h-3 w-3/4 rounded" />
        </div>
      ))}
    </div>
  );
}
