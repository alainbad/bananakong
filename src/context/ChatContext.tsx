
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Message, ChatRoom } from '@/types';
import { useLocation } from './LocationContext';

// Mock data - in a real app, this would come from a backend
const mockUsers: User[] = [
  {
    id: 'user1',
    name: 'Jane Smith',
    avatar: '/avatars/jane.jpg',
    location: { latitude: 37.7749, longitude: -122.4194 },
    isOnline: true,
  },
  {
    id: 'user2',
    name: 'John Doe',
    avatar: '/avatars/john.jpg',
    location: { latitude: 37.7748, longitude: -122.4193 },
    isOnline: true,
  },
  {
    id: 'user3',
    name: 'Alice Chen',
    location: { latitude: 37.7747, longitude: -122.4192 },
    isOnline: false,
    lastSeen: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
  },
];

const mockMessages: Message[] = [
  {
    id: 'msg1',
    senderId: 'user1',
    text: 'Anyone know what's causing this traffic?',
    timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
    isRead: true,
  },
  {
    id: 'msg2',
    senderId: 'user2',
    text: 'Looks like an accident up ahead. Might be stuck for a while.',
    timestamp: new Date(Date.now() - 1000 * 60 * 8), // 8 minutes ago
    isRead: true,
  },
  {
    id: 'msg3',
    senderId: 'user3',
    text: 'I see police cars ahead. Traffic should clear soon.',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    isRead: false,
  },
];

interface ChatContextType {
  nearbyUsers: User[];
  messages: Message[];
  activeChat: ChatRoom | null;
  sendMessage: (text: string) => void;
  startChat: (userId: string) => void;
  closeChat: () => void;
  isLoading: boolean;
}

const ChatContext = createContext<ChatContextType>({
  nearbyUsers: [],
  messages: [],
  activeChat: null,
  sendMessage: () => {},
  startChat: () => {},
  closeChat: () => {},
  isLoading: false,
});

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [nearbyUsers, setNearbyUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [activeChat, setActiveChat] = useState<ChatRoom | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { currentLocation, radius } = useLocation();

  // Current user - in a real app, this would come from auth
  const currentUser: User = {
    id: 'currentUser',
    name: 'You',
    location: currentLocation || { latitude: 0, longitude: 0 },
    isOnline: true,
  };

  // Find nearby users based on location
  useEffect(() => {
    if (!currentLocation) return;

    // In a real app, this would query a database
    const fetchNearbyUsers = () => {
      setIsLoading(true);
      
      // Simulate API delay
      setTimeout(() => {
        // Filter users within radius
        // This is a simple approximation - a real app would use proper geospatial queries
        const nearby = mockUsers.filter(user => {
          const distance = calculateDistance(
            currentLocation.latitude,
            currentLocation.longitude,
            user.location.latitude,
            user.location.longitude
          );
          return distance <= radius;
        });
        
        setNearbyUsers(nearby);
        setIsLoading(false);
      }, 1000);
    };

    fetchNearbyUsers();
  }, [currentLocation, radius]);

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    // Haversine formula to calculate distance between two points on Earth
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance; // Distance in meters
  };

  const sendMessage = (text: string) => {
    if (!activeChat) return;
    
    const newMessage: Message = {
      id: `msg${Date.now()}`,
      senderId: currentUser.id,
      text,
      timestamp: new Date(),
      isRead: false,
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // In a real app, this would send to a backend
  };

  const startChat = (userId: string) => {
    const user = nearbyUsers.find(u => u.id === userId);
    if (!user) return;
    
    // Create or retrieve existing chat room
    const newChat: ChatRoom = {
      id: `chat${Date.now()}`,
      participants: [currentUser, user],
      messages: messages.filter(m => m.senderId === userId || m.senderId === currentUser.id),
      createdAt: new Date(),
    };
    
    setActiveChat(newChat);
  };

  const closeChat = () => {
    setActiveChat(null);
  };

  return (
    <ChatContext.Provider
      value={{
        nearbyUsers,
        messages,
        activeChat,
        sendMessage,
        startChat,
        closeChat,
        isLoading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
