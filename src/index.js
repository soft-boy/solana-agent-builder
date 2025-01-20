import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { SupabaseProvider } from './lib/SupabaseContext';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SupabaseProvider>
      <App />
    </SupabaseProvider>
  </React.StrictMode>
);
