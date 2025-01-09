import React, { useState } from 'react';
import { Calendar, Clock, MapPin, User, Phone, Mail, CheckCircle, AlertCircle, Download, Edit2, Save } from 'lucide-react';
import { CalendarEvent, Recipe, MenuItem } from '../../types';
import { generateShoppingList, downloadShoppingList } from '../../utils/recipeCalculator';
import CustomerForm from '../forms/CustomerForm';
import DeliveryForm from '../forms/DeliveryForm';
import EventTypeForm from '../forms/EventTypeForm';
import FoodSelectionForm from '../forms/FoodSelectionForm';
import DietaryForm from '../forms/DietaryForm';

interface EventDetailsProps {
  event: CalendarEvent;
  recipes: Recipe[];
  menuItems: MenuItem[];
  onEdit: (updatedEvent: CalendarEvent) => void;
}

export default function EventDetails({ event, recipes, menuItems, onEdit }: EventDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedEvent, setEditedEvent] = useState(event);

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800'
  };

  const handleDownloadIngredients = () => {
    const eventRecipes = recipes.filter(recipe => 
      event.selectedItems.some(item => item.itemId === recipe.menuItemId)
    );

    if (eventRecipes.length === 0) {
      alert('No recipes found for the selected items.');
      return;
    }

    const shoppingList = generateShoppingList(eventRecipes, event.guestCount);
    const filename = `ingredients-${event.customerInfo.fullName}-${event.deliveryInfo.deliveryDate}.txt`;
    downloadShoppingList(shoppingList, filename);
  };

  const calculateTotalPrice = () => {
    return event.selectedItems.reduce((total, item) => {
      const menuItem = menuItems.find(m => m.id === item.itemId);
      if (!menuItem) return total;
      return total + (menuItem.price * item.quantity * event.guestCount);
    }, 0);
  };

  const handleSaveEdit = () => {
    const updatedEvent = {
      ...editedEvent,
      totalAmount: calculateTotalPrice(),
    };
    onEdit(updatedEvent);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Edit Event</h3>
          <button
            onClick={handleSaveEdit}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </button>
        </div>

        <div className="space-y-6">
          <section>
            <h4 className="text-sm font-medium text-gray-700 mb-4">Customer Information</h4>
            <CustomerForm
              value={editedEvent.customerInfo}
              onChange={(customerInfo) => setEditedEvent({ ...editedEvent, customerInfo })}
            />
          </section>

          <section>
            <h4 className="text-sm font-medium text-gray-700 mb-4">Delivery Information</h4>
            <DeliveryForm
              value={editedEvent.deliveryInfo}
              onChange={(deliveryInfo) => setEditedEvent({ ...editedEvent, deliveryInfo })}
            />
          </section>

          <section>
            <h4 className="text-sm font-medium text-gray-700 mb-4">Event Details</h4>
            <EventTypeForm
              eventType={editedEvent.eventType}
              guestCount={editedEvent.guestCount}
              onEventTypeChange={(eventType) => setEditedEvent({ ...editedEvent, eventType })}
              onGuestCountChange={(guestCount) => setEditedEvent({ ...editedEvent, guestCount })}
            />
          </section>

          <section>
            <h4 className="text-sm font-medium text-gray-700 mb-4">Menu Selection</h4>
            <FoodSelectionForm
              menuItems={menuItems}
              selectedItems={editedEvent.selectedItems}
              onSelectionChange={(selectedItems) => setEditedEvent({ ...editedEvent, selectedItems })}
            />
          </section>

          <section>
            <h4 className="text-sm font-medium text-gray-700 mb-4">Dietary Information</h4>
            <DietaryForm
              dietaryRestrictions={editedEvent.dietaryRestrictions}
              allergenInfo={editedEvent.allergenInfo}
              onDietaryChange={(dietaryRestrictions) => setEditedEvent({ ...editedEvent, dietaryRestrictions })}
              onAllergenChange={(allergenInfo) => setEditedEvent({ ...editedEvent, allergenInfo })}
            />
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-medium">
            {event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1)} Event
          </h3>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${statusColors[event.status]}`}>
            {event.status === 'pending' && <AlertCircle size={12} className="mr-1" />}
            {event.status === 'confirmed' && <CheckCircle size={12} className="mr-1" />}
            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-lg font-semibold">${calculateTotalPrice().toFixed(2)}</span>
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <Edit2 className="h-5 w-5" />
          </button>
          <button
            onClick={handleDownloadIngredients}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Download className="h-4 w-4 mr-1" />
            Ingredients List
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="space-y-4">
          <h4 className="font-medium text-gray-700">Customer Information</h4>
          <div className="space-y-2">
            <div className="flex items-center">
              <User className="h-4 w-4 text-gray-400 mr-2" />
              <span>{event.customerInfo.fullName}</span>
            </div>
            <div className="flex items-center">
              <Phone className="h-4 w-4 text-gray-400 mr-2" />
              <span>{event.customerInfo.contactNumber}</span>
            </div>
            {event.customerInfo.email && (
              <div className="flex items-center">
                <Mail className="h-4 w-4 text-gray-400 mr-2" />
                <span>{event.customerInfo.email}</span>
              </div>
            )}
          </div>
        </section>

        <section className="space-y-4">
          <h4 className="font-medium text-gray-700">Delivery Information</h4>
          <div className="space-y-2">
            <div className="flex items-start">
              <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-1" />
              <span>{event.deliveryInfo.address}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-gray-400 mr-2" />
              <span>{new Date(event.deliveryInfo.deliveryDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-gray-400 mr-2" />
              <span>{event.deliveryInfo.deliveryTime}</span>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h4 className="font-medium text-gray-700">Order Details</h4>
          <div className="space-y-2">
            <p>Guest Count: {event.guestCount}</p>
            <div className="space-y-1">
              <p className="font-medium">Selected Items:</p>
              {event.selectedItems.map(item => {
                const menuItem = menuItems.find(m => m.id === item.itemId);
                if (!menuItem) return null;
                return (
                  <div key={item.itemId} className="flex justify-between text-sm">
                    <span>{menuItem.name}</span>
                    <span>
                      {item.quantity} × ${menuItem.price} × {event.guestCount} = 
                      ${(menuItem.price * item.quantity * event.guestCount).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h4 className="font-medium text-gray-700">Dietary Information</h4>
          {event.dietaryRestrictions.length > 0 && (
            <div>
              <p className="text-sm font-medium">Dietary Restrictions:</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {event.dietaryRestrictions.map(restriction => (
                  <span
                    key={restriction}
                    className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800"
                  >
                    {restriction}
                  </span>
                ))}
              </div>
            </div>
          )}
          {event.allergenInfo.length > 0 && (
            <div>
              <p className="text-sm font-medium">Allergen Information:</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {event.allergenInfo.map(allergen => (
                  <span
                    key={allergen}
                    className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800"
                  >
                    {allergen}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>

      {event.deliveryInfo.specialInstructions && (
        <section className="space-y-2">
          <h4 className="font-medium text-gray-700">Special Instructions</h4>
          <p className="text-sm text-gray-600">{event.deliveryInfo.specialInstructions}</p>
        </section>
      )}
    </div>
  );
}