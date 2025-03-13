
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { GeoLocation } from '@/types';

interface LocationContextType {
  currentLocation: GeoLocation | null;
  isLocating: boolean;
  locationError: string | null;
  updateLocation: () => Promise<void>;
  setRadius: (radius: number) => void;
  radius: number;
}

const LocationContext = createContext<LocationContextType>({
  currentLocation: null,
  isLocating: false,
  locationError: null,
  updateLocation: async () => {},
  setRadius: () => {},
  radius: 500, // Default 500m radius
});

export const useLocation = () => useContext(LocationContext);

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [currentLocation, setCurrentLocation] = useState<GeoLocation | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [radius, setRadius] = useState<number>(500);

  const updateLocation = async (): Promise<void> => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });

      setCurrentLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp
      });
    } catch (error) {
      console.error('Error getting location:', error);
      
      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case 1:
            setLocationError('Location permission denied');
            break;
          case 2:
            setLocationError('Location unavailable');
            break;
          case 3:
            setLocationError('Location request timed out');
            break;
          default:
            setLocationError('Unknown location error');
        }
      } else {
        setLocationError('Failed to get your location');
      }
    } finally {
      setIsLocating(false);
    }
  };

  // Fetch location on initial load
  useEffect(() => {
    updateLocation();
    
    // Set up periodic location updates
    const intervalId = setInterval(() => {
      updateLocation();
    }, 60000); // Update every minute
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <LocationContext.Provider 
      value={{ 
        currentLocation, 
        isLocating, 
        locationError, 
        updateLocation,
        radius,
        setRadius
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};
