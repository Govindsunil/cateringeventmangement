import React from 'react';
import { Bot, User } from 'lucide-react';
import type { Message } from './types';

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div
      className={`flex ${
        message.sender === 'user' ? 'justify-end' : 'justify-start'
      }`}
    >
      <div
        className={`flex items-start space-x-2 max-w-[80%] ${
          message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'
        }`}
      >
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          message.sender === 'user' ? 'bg-indigo-100' : 'bg-gray-100'
        }`}>
          {message.sender === 'user' ? (
            <User className="h-5 w-5 text-indigo-600" />
          ) : (
            <Bot className="h-5 w-5 text-gray-600" />
          )}
        </div>
        <div
          className={`rounded-lg p-3 ${
            message.sender === 'user'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-900'
          }`}
        >
          {message.text}
        </div>
      </div>
    </div>
  );
}