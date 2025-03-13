
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Map from '@/components/Map';
import ChatPanel from '@/components/ChatPanel';
import RadiusControl from '@/components/RadiusControl';
import UserProfile from '@/components/UserProfile';
import Loader from '@/components/Loader';
import { useLocation } from '@/context/LocationContext';

const Index = () => {
  const { locationError } = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return <Loader message="Finding traffic buddies..." />;
  }
  
  return (
    <Layout>
      <div className="relative min-h-screen flex flex-col">
        {/* Location error notification */}
        {locationError && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-destructive text-destructive-foreground px-4 py-2 rounded-lg shadow-lg">
            {locationError}
          </div>
        )}
        
        {/* Main content */}
        <div className="flex-1 flex flex-col md:flex-row p-4 gap-4">
          {/* Map area */}
          <div className="flex-1 rounded-2xl overflow-hidden shadow-sm min-h-[50vh] md:min-h-[calc(100vh-2rem)]">
            <Map />
          </div>
          
          {/* Chat and controls area */}
          <div className="w-full md:w-[400px] flex flex-col gap-4">
            {/* Chat panel */}
            <div className="flex-1 min-h-[400px] md:min-h-0">
              <ChatPanel />
            </div>
            
            {/* Controls */}
            <div className="space-y-4">
              <UserProfile />
              <RadiusControl />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
