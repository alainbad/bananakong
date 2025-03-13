
import React, { ReactNode } from 'react';
import { LocationProvider } from '@/context/LocationContext';
import { ChatProvider } from '@/context/ChatContext';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <LocationProvider>
      <ChatProvider>
        <div className="min-h-screen">
          {children}
        </div>
      </ChatProvider>
    </LocationProvider>
  );
};

export default Layout;
