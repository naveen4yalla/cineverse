import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-28 text-center">
      <p className="text-7xl font-black text-gradient">404</p>
      <h1 className="mt-3 text-2xl font-bold">Page not found</h1>
      <p className="mt-2 text-white/50">The reel you’re looking for isn’t here.</p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-full bg-accent-gradient px-5 py-2.5 text-sm font-bold text-black transition hover:opacity-90"
      >
        Back home
      </Link>
    </div>
  );
}
