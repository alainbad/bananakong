
import React from 'react';
import { Navigation } from 'lucide-react';

interface LoaderProps {
  message?: string;
}

const Loader: React.FC<LoaderProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center">
        <div className="relative">
          <div className="absolute inset-0 rounded-full animate-pulse-soft bg-primary/10"></div>
          <div className="bg-primary text-white p-4 rounded-full shadow-lg">
            <Navigation className="w-8 h-8 animate-spin" />
          </div>
        </div>
        <p className="mt-4 text-muted-foreground">{message}</p>
      </div>
    </div>
  );
};

export default Loader;
