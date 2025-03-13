
import React from 'react';
import { Button } from '@/components/ui/button';
import { User, MapPin, Settings } from 'lucide-react';

const UserProfile: React.FC = () => {
  return (
    <div className="glass rounded-2xl p-4 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="bg-primary text-primary-foreground rounded-full p-3">
          <User className="w-6 h-6" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold">Your Profile</h3>
          <div className="flex items-center text-sm text-muted-foreground mt-0.5">
            <MapPin className="w-3.5 h-3.5 mr-1" />
            <span>Available for chat</span>
          </div>
        </div>
        
        <Button variant="ghost" size="icon">
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default UserProfile;
