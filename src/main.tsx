import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import './index.css';
import App from './App.tsx';
import { WatchlistProvider } from './context/WatchlistContext';
import { MediaProvider } from './context/MediaContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <MediaProvider>
        <WatchlistProvider>
          <App />
        </WatchlistProvider>
      </MediaProvider>
    </HashRouter>
  </StrictMode>,
);
