import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import CustomerForm from './forms/CustomerForm';
import DeliveryForm from './forms/DeliveryForm';
import EventTypeForm from './forms/EventTypeForm';
import FoodSelectionForm from './forms/FoodSelectionForm';
import DietaryForm from './forms/DietaryForm';
import type { Event, CustomerInfo, DeliveryInfo, MenuItem } from '../types';

interface NewEventFormProps {
  menuItems: MenuItem[];
  onSubmit: (event: Event) => void;
}

export default function NewEventForm({ menuItems, onSubmit }: NewEventFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    fullName: '',
    contactNumber: '',
    email: '',
  });
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo>({
    address: '',
    deliveryDate: '',
    deliveryTime: '',
    specialInstructions: '',
  });
  const [eventType, setEventType] = useState('');
  const [guestCount, setGuestCount] = useState(0);
  const [selectedItems, setSelectedItems] = useState<Array<{ itemId: string; quantity: number }>>([]);
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const [allergenInfo, setAllergenInfo] = useState<string[]>([]);
  const [specialRequests, setSpecialRequests] = useState('');

  const steps = [
    { title: 'Customer Information', component: CustomerForm },
    { title: 'Delivery Information', component: DeliveryForm },
    { title: 'Event Details', component: EventTypeForm },
    { title: 'Menu Selection', component: FoodSelectionForm },
    { title: 'Dietary Information', component: DietaryForm },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newEvent: Event = {
      id: uuidv4(),
      customerInfo,
      deliveryInfo,
      eventType: eventType as 'wedding' | 'birthday' | 'corporate' | 'other',
      guestCount,
      selectedItems: selectedItems.map(item => ({
        type: 'individual',
        itemId: item.itemId,
        quantity: item.quantity,
      })),
      dietaryRestrictions,
      allergenInfo,
      specialRequests,
      status: 'pending',
      totalAmount: calculateTotalAmount(),
    };

    onSubmit(newEvent);
  };

  const calculateTotalAmount = () => {
    return selectedItems.reduce((total, item) => {
      const menuItem = menuItems.find(m => m.id === item.itemId);
      return total + (menuItem?.price || 0) * item.quantity;
    }, 0);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return customerInfo.fullName && customerInfo.contactNumber;
      case 2:
        return deliveryInfo.address && deliveryInfo.deliveryDate && deliveryInfo.deliveryTime;
      case 3:
        return eventType && guestCount > 0;
      case 4:
        return selectedItems.length > 0;
      default:
        return true;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex items-center ${
                index < currentStep - 1
                  ? 'text-indigo-600'
                  : index === currentStep - 1
                  ? 'text-indigo-600'
                  : 'text-gray-400'
              }`}
            >
              <span className="flex items-center justify-center w-8 h-8 border-2 rounded-full">
                {index + 1}
              </span>
              <span className="ml-2 text-sm hidden sm:inline">{step.title}</span>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {currentStep === 1 && (
          <CustomerForm value={customerInfo} onChange={setCustomerInfo} />
        )}
        {currentStep === 2 && (
          <DeliveryForm value={deliveryInfo} onChange={setDeliveryInfo} />
        )}
        {currentStep === 3 && (
          <EventTypeForm
            eventType={eventType}
            guestCount={guestCount}
            onEventTypeChange={setEventType}
            onGuestCountChange={setGuestCount}
          />
        )}
        {currentStep === 4 && (
          <FoodSelectionForm
            menuItems={menuItems}
            selectedItems={selectedItems}
            onSelectionChange={setSelectedItems}
          />
        )}
        {currentStep === 5 && (
          <>
            <DietaryForm
              dietaryRestrictions={dietaryRestrictions}
              allergenInfo={allergenInfo}
              onDietaryChange={setDietaryRestrictions}
              onAllergenChange={setAllergenInfo}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Special Requests
              </label>
              <textarea
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </>
        )}

        <div className="flex justify-between pt-4">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Previous
            </button>
          )}
          {currentStep < steps.length ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!canProceed()}
              className="ml-auto inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="ml-auto inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Create Event
            </button>
          )}
        </div>
      </form>
    </div>
  );
}