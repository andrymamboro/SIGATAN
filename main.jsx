import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

import { createContext } from 'react';
console.log('typeof createContext:', typeof createContext);

if (typeof window !== 'undefined') {
  // ...existing code...
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);