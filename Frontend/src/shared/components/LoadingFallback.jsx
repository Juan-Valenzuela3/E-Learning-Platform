import React from 'react';
import LoadingSpinner from '@/shared/components/LoadingSpinner';

const LoadingFallback = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <LoadingSpinner />
  </div>
);

export default LoadingFallback;
