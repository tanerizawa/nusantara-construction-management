import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initErrorSuppression } from './utils/suppressWebSocketErrors';

// Initialize error suppression for WebSocket errors
initErrorSuppression();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
