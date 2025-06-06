import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx'; // Switched back to original App
// import AppMinimal from './App.minimal.tsx'; // Commented out AppMinimal
import './index.css';
import './i18n';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App /> 
    {/* <AppMinimal /> Replaced with App for debugging */}
  </StrictMode>
);
