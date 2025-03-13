import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '@/context/ChatContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, X, User, Users, MessageCircle } from 'lucide-react';
import { Avatar } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ChatPanel: React.FC = () => {
  const { nearbyUsers, messages, activeChat, sendMessage, startChat, closeChat, isLoading } = useChat();
  const [messageText, setMessageText] = useState('');
  const [activeTab, setActiveTab] = useState('nearby');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom of chat when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, activeChat]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    
    sendMessage(messageText);
    setMessageText('');
  };
  
  // Chat panel header
  const renderHeader = () => (
    <div className="border-b p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <MessageCircle className="w-5 h-5 text-primary" />
        <h2 className="font-semibold">
          {activeChat 
            ? activeChat.participants.find(p => p.id !== 'currentUser')?.name
            : 'Traffic Chat'
          }
        </h2>
      </div>
      {activeChat && (
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={closeChat}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
  
  // Render active conversation
  const renderActiveChat = () => (
    <div className="flex-1 flex flex-col h-full">
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {activeChat?.messages.map((message) => {
            const isCurrentUser = message.senderId === 'currentUser';
            const user = activeChat?.participants.find(p => p.id === message.senderId);
            
            return (
              <div 
                key={message.id} 
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                    isCurrentUser 
                      ? 'bg-primary text-primary-foreground rounded-tr-none' 
                      : 'bg-secondary text-secondary-foreground rounded-tl-none'
                  } animate-fade-in`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium">
                      {isCurrentUser ? 'You' : user?.name}
                    </span>
                    <span className="text-xs opacity-70">
                      {new Date(message.timestamp).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                  <p>{message.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
      
      <form 
        onSubmit={handleSendMessage} 
        className="border-t p-4 flex items-center gap-2"
      >
        <Input
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1"
        />
        <Button type="submit" size="icon" disabled={!messageText.trim()}>
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
  
  // Render nearby users list
  const renderNearbyUsers = () => (
    <ScrollArea className="flex-1">
      <div className="p-4 space-y-3">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-pulse-soft">
              <Users className="w-10 h-10 mx-auto mb-3 text-muted-foreground/70" />
              <p className="text-sm text-muted-foreground">Finding nearby users...</p>
            </div>
          </div>
        ) : nearbyUsers.length === 0 ? (
          <div className="text-center py-8">
            <User className="w-10 h-10 mx-auto mb-3 text-muted-foreground/70" />
            <p className="text-sm text-muted-foreground">No one nearby right now</p>
            <p className="text-xs text-muted-foreground mt-1">Try increasing your chat radius</p>
          </div>
        ) : (
          nearbyUsers.map((user) => (
            <div 
              key={user.id}
              className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-secondary cursor-pointer transition-colors animate-slide-up"
              onClick={() => startChat(user.id)}
            >
              <Avatar className="relative">
                <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${
                  user.isOnline ? 'bg-green-500' : 'bg-gray-400'
                }`} />
                <div className="bg-secondary w-10 h-10 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-muted-foreground" />
                </div>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="font-medium">{user.name}</div>
                <div className="text-xs text-muted-foreground truncate">
                  {user.isOnline 
                    ? 'Online now' 
                    : `Last seen ${user.lastSeen ? new Date(user.lastSeen).toLocaleTimeString() : 'recently'}`
                  }
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </ScrollArea>
  );
  
  // When active chat is present, show the conversation
  if (activeChat) {
    return (
      <div className="glass h-full flex flex-col rounded-2xl shadow-sm overflow-hidden">
        {renderHeader()}
        {renderActiveChat()}
      </div>
    );
  }
  
  // Otherwise show tabs with nearby users and chat history
  return (
    <div className="glass h-full flex flex-col rounded-2xl shadow-sm overflow-hidden">
      {renderHeader()}
      <Tabs 
        defaultValue="nearby" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col"
      >
        <TabsList className="grid grid-cols-2 px-4 py-2 bg-transparent">
          <TabsTrigger value="nearby" className="rounded-lg text-sm">
            <Users className="w-4 h-4 mr-2" />
            Nearby
          </TabsTrigger>
          <TabsTrigger value="messages" className="rounded-lg text-sm">
            <MessageCircle className="w-4 h-4 mr-2" />
            Messages
          </TabsTrigger>
        </TabsList>
        <TabsContent value="nearby" className="flex-1 m-0 data-[state=inactive]:hidden">
          {renderNearbyUsers()}
        </TabsContent>
        <TabsContent value="messages" className="flex-1 m-0 data-[state=inactive]:hidden">
          <div className="p-8 text-center text-muted-foreground">
            <MessageCircle className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p>Select a user to start chatting</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChatPanel;
