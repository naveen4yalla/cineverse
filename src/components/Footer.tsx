import { Clapperboard, Code2 } from 'lucide-react';
import { LIVE_MODE } from '../lib/api';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10 bg-ink-950/60">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-accent-gradient text-black">
            <Clapperboard className="h-4 w-4" />
          </span>
          <span className="text-sm font-bold">
            Cine<span className="text-gradient">verse</span>
          </span>
          <span className="ml-2 text-xs text-white/40">
            {LIVE_MODE ? 'Live TMDB data' : 'Demo mode · embedded dataset'}
          </span>
        </div>
        <p className="text-xs text-white/40">
          Built with React, TypeScript &amp; Tailwind. Movie metadata &amp; imagery courtesy of{' '}
          <a href="https://www.themoviedb.org" className="text-white/60 underline-offset-2 hover:underline">
            TMDB
          </a>
          .
        </p>
        <a
          href="https://github.com/naveen4yalla/cineverse"
          className="inline-flex w-fit items-center gap-1.5 text-xs text-white/50 transition hover:text-white"
        >
          <Code2 className="h-4 w-4" /> Source
        </a>
      </div>
    </footer>
  );
}
