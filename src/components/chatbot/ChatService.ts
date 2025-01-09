import { Recipe, MenuItem } from '../../types';

export interface ChatResponse {
  text: string;
  type: 'text' | 'recipe' | 'navigation';
}

export class ChatService {
  private static processRecipeQuery(query: string): string {
    return `Here's what I found about "${query}":\n\n` +
           `I can help you find recipes and cooking instructions. ` +
           `Would you like me to search for specific recipes or cooking techniques?`;
  }

  private static processNavigationQuery(query: string): string {
    const navigationGuides = {
      'new event': 'To create a new event:\n1. Click the "New Event" tab\n2. Fill out customer details\n3. Select food items\n4. Add delivery information\n5. Review and submit',
      'calendar': 'To view the calendar:\n1. Click the "Calendar" tab\n2. Click on any date to view events\n3. Click an event to see details',
      'food items': 'To manage food items:\n1. Go to "Management" tab\n2. Click "Add Food Item" to create new items\n3. Use edit/delete buttons to modify existing items',
      'download ingredients': 'To download ingredients list:\n1. Open the event in calendar view\n2. Click "Download Ingredients"\n3. The list will be scaled based on guest count'
    };

    const topic = Object.keys(navigationGuides).find(key => 
      query.toLowerCase().includes(key)
    );

    return topic 
      ? navigationGuides[topic as keyof typeof navigationGuides]
      : 'How can I help you navigate the application? You can ask about:\n- Creating new events\n- Using the calendar\n- Managing food items\n- Downloading ingredients';
  }

  static async generateResponse(message: string): Promise<ChatResponse> {
    const lowerMessage = message.toLowerCase();
    
    // Recipe related queries
    if (lowerMessage.includes('recipe') || lowerMessage.includes('how to make') || lowerMessage.includes('cook')) {
      return {
        text: this.processRecipeQuery(message),
        type: 'recipe'
      };
    }
    
    // Navigation related queries
    if (lowerMessage.includes('how') || lowerMessage.includes('where') || lowerMessage.includes('what')) {
      return {
        text: this.processNavigationQuery(message),
        type: 'navigation'
      };
    }

    // Default response
    return {
      text: "I can help you with:\n- Finding recipes and cooking instructions\n- Navigating the application\n- Managing events and food items\n\nWhat would you like to know?",
      type: 'text'
    };
  }
}