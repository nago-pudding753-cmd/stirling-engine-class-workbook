import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './StirlingApp';
import './stirling.css';
import './lesson.css';
import './conditions.css';
import './conditions-overrides.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
