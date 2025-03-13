
import { Message } from '@/types';

// Format timestamp to readable time
export const formatMessageTime = (timestamp: Date): string => {
  const now = new Date();
  const messageDate = new Date(timestamp);
  
  // Check if the message is from today
  if (
    messageDate.getDate() === now.getDate() &&
    messageDate.getMonth() === now.getMonth() &&
    messageDate.getFullYear() === now.getFullYear()
  ) {
    return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  // Check if the message is from yesterday
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  
  if (
    messageDate.getDate() === yesterday.getDate() &&
    messageDate.getMonth() === yesterday.getMonth() &&
    messageDate.getFullYear() === yesterday.getFullYear()
  ) {
    return `Yesterday, ${messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  
  // For older messages, show the date
  return messageDate.toLocaleDateString([], { 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

// Sort messages by timestamp
export const sortMessagesByTimestamp = (messages: Message[]): Message[] => {
  return [...messages].sort((a, b) => {
    return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
  });
};

// Group messages by date
export const groupMessagesByDate = (messages: Message[]): Record<string, Message[]> => {
  const groups: Record<string, Message[]> = {};
  
  messages.forEach(message => {
    const date = new Date(message.timestamp).toLocaleDateString();
    
    if (!groups[date]) {
      groups[date] = [];
    }
    
    groups[date].push(message);
  });
  
  return groups;
};

// Generate a unique message ID
export const generateMessageId = (): string => {
  return `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};
