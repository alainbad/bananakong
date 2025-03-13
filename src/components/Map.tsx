
import React, { useEffect, useRef, useState } from 'react';
import { User } from '@/types';
import { useLocation } from '@/context/LocationContext';
import { useChat } from '@/context/ChatContext';
import { MapPin, Navigation, UserCircle } from 'lucide-react';

// In a real app, this would be integrated with a map library like Mapbox, Google Maps, etc.
// For this demo, we'll create a simplified visualization

const Map: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const { currentLocation, radius } = useLocation();
  const { nearbyUsers, startChat } = useChat();
  const [mapScale, setMapScale] = useState(1);
  
  // Calculate positions relative to the center (current user)
  useEffect(() => {
    if (!currentLocation) return;
    
    // In a real implementation, this would be handled by the map library
    setMapScale(100 / radius * 300); // Scale based on radius
  }, [currentLocation, radius]);
  
  if (!currentLocation) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-secondary/50">
        <div className="text-center animate-pulse-soft">
          <Navigation className="w-12 h-12 mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Locating you...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative h-full w-full overflow-hidden bg-blue-50">
      {/* Simulated map with gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-200 to-blue-50" />
      
      {/* Radar circles */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          <div className="absolute rounded-full bg-primary/5 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute rounded-full bg-primary/10 w-[400px] h-[400px] -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute rounded-full bg-primary/15 w-[200px] h-[200px] -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>
      
      {/* User marker (you) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="relative">
          <div className="absolute -inset-2 rounded-full bg-primary/20 animate-pulse-soft" />
          <div className="bg-primary text-white p-3 rounded-full shadow-lg">
            <Navigation className="w-6 h-6" />
          </div>
          <div className="mt-2 text-center font-medium text-sm text-primary-foreground px-2 py-1 rounded-full bg-primary">
            You
          </div>
        </div>
      </div>
      
      {/* Nearby users */}
      {nearbyUsers.map((user, index) => {
        // Calculate relative position (simplified)
        // In a real app, this would use proper geo calculations
        const latDiff = (user.location.latitude - (currentLocation?.latitude ?? 0)) * mapScale;
        const lngDiff = (user.location.longitude - (currentLocation?.longitude ?? 0)) * mapScale;
        
        // Add some randomization for demo purposes
        const offsetX = latDiff * 100 + Math.sin(index) * 100;
        const offsetY = lngDiff * 100 + Math.cos(index) * 100;
        
        const distanceStyle = {
          transform: `translate(${offsetX}px, ${offsetY}px)`,
        };
        
        return (
          <div 
            key={user.id}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 animate-float cursor-pointer transition-transform hover:scale-110"
            style={distanceStyle}
            onClick={() => startChat(user.id)}
          >
            <div className="relative">
              <div className={`${user.isOnline ? 'bg-green-400' : 'bg-gray-400'} p-3 rounded-full shadow-md`}>
                <UserCircle className="w-5 h-5 text-white" />
              </div>
              <div className="mt-1 text-center text-xs font-medium px-2 py-0.5 rounded-full bg-white/80 backdrop-blur-sm">
                {user.name}
              </div>
            </div>
          </div>
        );
      })}
      
      {/* Range indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md text-sm font-medium text-primary">
        Range: {(radius / 1000).toFixed(1)} km
      </div>
    </div>
  );
};

export default Map;
