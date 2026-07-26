import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { setupErrorInterceptor } from './lib/errorInterceptor';

setupErrorInterceptor();

// Service Worker Registration for PWA support (Ensuring execution even if load event already fired)
if ('serviceWorker' in navigator) {
  const registerSW = () => {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((registration) => {
        console.log('[EduMentor PWA] Service Worker registered successfully with scope:', registration.scope);
        // Request immediate update check
        registration.update();
      })
      .catch((error) => {
        console.warn('[EduMentor PWA] Service Worker registration failed:', error);
      });
  };

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    registerSW();
  } else {
    window.addEventListener('load', registerSW);
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

