import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <>
      <App />
      <div className="relative flex items-center justify-between w-full p-1 pr-2 bg-slate-50">
        <div className="flex-1" />
        <p className="absolute left-1/2 transform -translate-x-1/2 text-center text-md text-gray-700 opacity-60 mb-2 select-none">
          © 2026 Water Rats. All rights reserved | Nathan Wong
        </p>
        <div 
          className="text-right z-1000 text-gray-700 text-md opacity-60 cursor-pointer hover:opacity-100 transition-opacity underline select-none"
          onClick={() => window.location.href = '/changelog'}
        >
          Version 0.3.5
        </div>
      </div>
    </>
  </StrictMode>
);
