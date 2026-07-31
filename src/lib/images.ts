const IMG = 'https://image.tmdb.org/t/p';

export function poster(path: string | null, size: 'w342' | 'w500' = 'w500'): string {
  if (!path) return placeholderPoster();
  return `${IMG}/${size}${path}`;
}

export function backdrop(path: string | null, size: 'w780' | 'w1280' = 'w1280'): string {
  if (!path) return placeholderBackdrop();
  return `${IMG}/${size}${path}`;
}

export function profile(path: string | null): string {
  if (!path) return placeholderProfile();
  return `${IMG}/w185${path}`;
}

// Inline SVG data-URI fallbacks so a missing image never shows a broken icon.
function placeholderPoster(): string {
  return svg(342, 513, 'No Poster');
}
function placeholderBackdrop(): string {
  return svg(1280, 720, '');
}
function placeholderProfile(): string {
  return svg(185, 185, '');
}
function svg(w: number, h: number, label: string): string {
  const s = `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'>
    <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
    <stop offset='0' stop-color='#181320'/><stop offset='1' stop-color='#0d0a0f'/></linearGradient></defs>
    <rect width='100%' height='100%' fill='url(#g)'/>
    <text x='50%' y='50%' fill='#5b5566' font-family='Inter,sans-serif' font-size='${Math.round(w / 14)}'
    text-anchor='middle' dominant-baseline='middle'>${label}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(s)}`;
}
