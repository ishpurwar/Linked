'use client';

import { useState, useEffect, useRef } from 'react';
import { Message, sendMessage, getMessages, subscribeToMessages } from '../lib/supabase';

interface ChatBoxProps {
  currentUserAddress: string;
  otherUserAddress: string;
  onClose: () => void;
}

export default function ChatBox({ currentUserAddress, otherUserAddress, onClose }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'polling' | 'realtime'>('connecting');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Load messages on component mount
  useEffect(() => {
    const loadMessages = async () => {
      setIsLoading(true);
      try {
        const fetchedMessages = await getMessages(currentUserAddress, otherUserAddress);
        setMessages(fetchedMessages);
      } catch (error) {
        console.error('Error loading messages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [currentUserAddress, otherUserAddress]);

  // Subscribe to real-time messages
  useEffect(() => {
    setConnectionStatus('connecting');
    
    const subscription = subscribeToMessages(
      currentUserAddress,
      otherUserAddress,
      (newMessage: Message) => {
        // Prevent duplicate messages
        setMessages(prev => {
          const exists = prev.some(msg => msg.id === newMessage.id);
          if (exists) return prev;
          return [...prev, newMessage];
        });
      }
    );

    // Set status to polling after a short delay (since we're using polling fallback)
    const statusTimer = setTimeout(() => {
      setConnectionStatus('polling');
    }, 1000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(statusTimer);
    };
  }, [currentUserAddress, otherUserAddress]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle sending message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    try {
      const sentMessage = await sendMessage(currentUserAddress, otherUserAddress, newMessage.trim());
      if (sentMessage) {
        setNewMessage('');
        // Message will be added via real-time subscription
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  // Format time
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-purple w-full max-w-md h-[600px] rounded-2xl flex flex-col overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="p-4 border-b border-purple-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-lg">💕</span>
            </div>
            <div>
              <p className="text-white font-semibold">Chat</p>
              <div className="flex items-center gap-2">
                <p className="text-gray-300 text-sm font-mono">
                  {otherUserAddress.slice(0, 6)}...{otherUserAddress.slice(-4)}
                </p>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  connectionStatus === 'connecting' ? 'bg-yellow-500/20 text-yellow-300' :
                  connectionStatus === 'polling' ? 'bg-blue-500/20 text-blue-300' :
                  'bg-green-500/20 text-green-300'
                }`}>
                  {connectionStatus === 'connecting' ? '⏳ Connecting' :
                   connectionStatus === 'polling' ? '🔄 Live' :
                   '⚡ Real-time'}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-600/50 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors"
          >
            <span className="text-gray-300">✕</span>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-purple-300">Loading messages...</div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-4xl mb-2">💬</div>
                <p className="text-gray-300">No messages yet</p>
                <p className="text-gray-400 text-sm">Start the conversation!</p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => {
                const isCurrentUser = message.sender_address.toLowerCase() === currentUserAddress.toLowerCase();
                return (
                  <div
                    key={message.id}
                    className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl ${
                        isCurrentUser
                          ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-br-sm'
                          : 'bg-gray-700 text-white rounded-bl-sm'
                      }`}
                    >
                      <p className="text-sm">{message.message}</p>
                      {message.created_at && (
                        <p className={`text-xs mt-1 ${
                          isCurrentUser ? 'text-purple-200' : 'text-gray-400'
                        }`}>
                          {formatTime(message.created_at)}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-purple-500/20">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-full border border-purple-500/20 focus:border-purple-500 focus:outline-none"
              disabled={isSending}
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || isSending}
              className="w-10 h-10 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105"
            >
              {isSending ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span>📤</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
