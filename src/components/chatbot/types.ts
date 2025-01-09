export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: number;
}

export interface ChatbotState {
  messages: Message[];
  isOpen: boolean;
  isMinimized: boolean;
  isTyping: boolean;
}