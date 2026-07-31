import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Bookmark, Clapperboard, Search as SearchIcon } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';
import { useMedia } from '../context/MediaContext';
import { LIVE_MODE } from '../lib/api';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/discover', label: 'Discover' },
  { to: '/watchlist', label: 'Watchlist' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [q, setQ] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { items } = useWatchlist();
  const { media, setMedia } = useMedia();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) navigate(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled ? 'border-b border-white/10 bg-ink-950/80 backdrop-blur-xl' : 'bg-gradient-to-b from-black/70 to-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-[1600px] items-center gap-3 px-4 sm:gap-5 sm:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent-gradient text-black">
            <Clapperboard className="h-5 w-5" />
          </span>
          <span className="hidden text-lg font-extrabold tracking-tight sm:block">
            Cine<span className="text-gradient">verse</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <form onSubmit={submit} className="relative ml-auto w-full max-w-xs">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search titles…  /"
            className="w-full rounded-full border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-white/25 focus:bg-white/10"
          />
        </form>

        {/* media toggle */}
        <div className="hidden shrink-0 items-center rounded-full border border-white/10 bg-white/5 p-0.5 text-xs font-semibold sm:flex">
          {(['movie', 'tv'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMedia(m)}
              className={`rounded-full px-3 py-1 transition ${
                media === m ? 'bg-accent-gradient text-black' : 'text-white/60 hover:text-white'
              }`}
            >
              {m === 'movie' ? 'Movies' : 'TV'}
            </button>
          ))}
        </div>

        <Link
          to="/watchlist"
          aria-label="Watchlist"
          className="relative shrink-0 rounded-lg border border-white/10 bg-white/5 p-2 text-white/70 transition hover:text-white"
        >
          <Bookmark className="h-4 w-4" />
          {items.length > 0 && (
            <span className="absolute -right-1.5 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-accent-gradient px-1 text-[10px] font-bold text-black">
              {items.length}
            </span>
          )}
        </Link>

        <span
          className={`hidden shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide lg:flex ${
            LIVE_MODE ? 'border-emerald-400/30 text-emerald-300' : 'border-white/10 text-white/50'
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${LIVE_MODE ? 'bg-emerald-400' : 'bg-amber-400'}`} />
          {LIVE_MODE ? 'Live' : 'Demo'}
        </span>
      </nav>
    </header>
  );
}
