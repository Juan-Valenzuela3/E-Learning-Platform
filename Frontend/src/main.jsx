// In your main application file, e.g., src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '@/services/queryClient'; // Import the client
import { NotificationProvider } from '@/contexts/NotificationContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
    <NotificationProvider>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </NotificationProvider>
    </QueryClientProvider>
  </React.StrictMode>
);