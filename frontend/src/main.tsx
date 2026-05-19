import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import './index.css';

/* =========================
   Root Validation
========================= */

const rootElement =
  document.getElementById('root');

if (!rootElement) {
  throw new Error(
    'Root element not found. Ensure <div id="root"></div> exists in index.html.'
  );
}

/* =========================
   Render App
========================= */

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);