import 'bootstrap/dist/css/bootstrap.min.css';
// src/index.tsx or src/App.tsx
import 'bootstrap-icons/font/bootstrap-icons.css'; // For Bootstrap Icons
// or
import '@fortawesome/fontawesome-free/css/all.min.css'; // For Font Awesome

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
