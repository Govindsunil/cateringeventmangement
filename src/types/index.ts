export interface CustomerInfo {
  fullName: string;
  contactNumber: string;
  email: string;
}

export interface DeliveryInfo {
  address: string;
  deliveryDate: string;
  deliveryTime: string;
  specialInstructions?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: 'appetizer' | 'mainCourse' | 'dessert' | 'beverage' | 'combo';
  price: number;
  isVegetarian: boolean;
  allergens: string[];
}

export interface Recipe {
  id: string;
  menuItemId: string;
  name: string;
  instructions: string;
  ingredients: {
    name: string;
    quantity: number;
    unit: string;
  }[];
}

export interface Event {
  id: string;
  customerInfo: CustomerInfo;
  deliveryInfo: DeliveryInfo;
  eventType: 'wedding' | 'birthday' | 'corporate' | 'other';
  guestCount: number;
  selectedItems: {
    type: 'combo' | 'individual';
    itemId: string;
    quantity: number;
  }[];
  dietaryRestrictions: string[];
  allergenInfo: string[];
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'completed';
  totalAmount: number;
}

export type CalendarEvent = Event;