import React from 'react';
import { X, Minimize2, Maximize2 } from 'lucide-react';

interface ChatHeaderProps {
  onClose: () => void;
  onMinimize: () => void;
  isMinimized: boolean;
}

export default function ChatHeader({ onClose, onMinimize, isMinimized }: ChatHeaderProps) {
  return (
    <div className="p-4 bg-indigo-600 text-white rounded-t-lg flex justify-between items-center">
      <h3 className="font-medium flex items-center space-x-2">
        <span>Chat Assistant</span>
        <span className="text-xs bg-indigo-500 px-2 py-1 rounded">Online</span>
      </h3>
      <div className="flex items-center space-x-2">
        <button
          onClick={onMinimize}
          className="text-white hover:text-gray-200 p-1"
          aria-label={isMinimized ? "Maximize chat" : "Minimize chat"}
        >
          {isMinimized ? (
            <Maximize2 className="h-4 w-4" />
          ) : (
            <Minimize2 className="h-4 w-4" />
          )}
        </button>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 p-1"
          aria-label="Close chat"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}