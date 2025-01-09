import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import type { Message } from './types';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import ChatHeader from './ChatHeader';
import { ChatService } from './ChatService';

const INITIAL_MESSAGE: Message = {
  id: 'welcome',
  text: "👋 Hi! I'm your catering assistant. I can help you with:\n\n" +
        "• Finding recipes and cooking videos\n" +
        "• Navigating the application\n" +
        "• Managing events and food items\n" +
        "• Calculating ingredients\n\n" +
        "What would you like to know?",
  sender: 'bot',
  timestamp: Date.now()
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current && chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (text: string) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      text,
      sender: 'user',
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const response = await ChatService.generateResponse(text);
      
      const botMessage: Message = {
        id: crypto.randomUUID(),
        text: response.text,
        sender: 'bot',
        timestamp: Date.now()
      };

      setTimeout(() => {
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
      }, 1000);
    } catch (error) {
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        text: "I apologize, but I'm having trouble processing your request. Please try again.",
        sender: 'bot',
        timestamp: Date.now()
      };

      setTimeout(() => {
        setMessages(prev => [...prev, errorMessage]);
        setIsTyping(false);
      }, 1000);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 p-4 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 z-50 transition-transform hover:scale-110"
          aria-label="Open chat assistant"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      )}

      {isOpen && (
        <div
          className={`fixed right-4 ${
            isMinimized ? 'bottom-20' : 'bottom-4'
          } w-96 bg-white rounded-lg shadow-xl transition-all duration-200 ease-in-out z-50 flex flex-col`}
          style={{ height: isMinimized ? 'auto' : '500px' }}
          role="dialog"
          aria-label="Chat assistant"
        >
          <ChatHeader
            onClose={() => setIsOpen(false)}
            onMinimize={toggleMinimize}
            isMinimized={isMinimized}
          />

          {!isMinimized && (
            <>
              <div 
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-4"
                style={{ height: 'calc(500px - 140px)' }}
              >
                {messages.map(message => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                {isTyping && (
                  <div className="flex items-center space-x-2 text-gray-500">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <span className="text-sm">Assistant is typing...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <ChatInput onSend={handleSend} disabled={isTyping} />
            </>
          )}
        </div>
      )}
    </>
  );
}