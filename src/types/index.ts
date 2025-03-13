
export interface User {
  id: string;
  name: string;
  avatar?: string;
  location: GeoLocation;
  isOnline: boolean;
  lastSeen?: Date;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: number;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  isRead: boolean;
}

export interface ChatRoom {
  id: string;
  participants: User[];
  messages: Message[];
  createdAt: Date;
}

export interface MapSettings {
  zoom: number;
  center: [number, number];
  radius: number;
  style: string;
}
