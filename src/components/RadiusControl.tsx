
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { useLocation } from '@/context/LocationContext';
import { MapPin } from 'lucide-react';

const RadiusControl: React.FC = () => {
  const { radius, setRadius } = useLocation();
  
  const handleRadiusChange = (value: number[]) => {
    setRadius(value[0]);
  };
  
  return (
    <div className="glass rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-sm font-medium">
          <MapPin className="w-4 h-4 text-primary" />
          <span>Chat Radius</span>
        </div>
        <span className="text-sm font-semibold text-primary">{(radius / 1000).toFixed(1)} km</span>
      </div>
      
      <Slider
        value={[radius]}
        min={100}
        max={1000}
        step={100}
        onValueChange={handleRadiusChange}
        className="py-1"
      />
      
      <div className="flex justify-between mt-1 text-xs text-muted-foreground">
        <span>100m</span>
        <span>1km</span>
      </div>
    </div>
  );
};

export default RadiusControl;
