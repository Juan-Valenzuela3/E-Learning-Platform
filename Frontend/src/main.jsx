import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { NotificationProvider } from './contexts/NotificationContext';
import { Toaster } from 'sonner';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <NotificationProvider>
      <App />
      <Toaster position="top-right" richColors closeButton />
    </NotificationProvider>
  </React.StrictMode>
);
