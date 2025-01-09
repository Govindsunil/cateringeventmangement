import React, { useState } from 'react';
import { Utensils, CalendarDays, PlusCircle, Settings } from 'lucide-react';
import Calendar from './components/calendar/Calendar';
import NewEventForm from './components/NewEventForm';
import FoodItemManager from './components/management/FoodItemManager';
import Chatbot from './components/chatbot/Chatbot';
import type { Event, MenuItem, Recipe } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<'calendar' | 'newEvent' | 'management'>('calendar');
  const [events, setEvents] = useState<Event[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  const handleNewEvent = (event: Event) => {
    setEvents([...events, event]);
    setActiveTab('calendar');
  };

  const handleAddMenuItem = (item: MenuItem, recipe?: Recipe) => {
    setMenuItems([...menuItems, item]);
    if (recipe) {
      setRecipes([...recipes, { ...recipe, menuItemId: item.id }]);
    }
  };

  const handleEditMenuItem = (id: string, updatedItem: MenuItem, recipe?: Recipe) => {
    setMenuItems(menuItems.map(item => 
      item.id === id ? updatedItem : item
    ));
    if (recipe) {
      setRecipes(recipes.map(r => 
        r.menuItemId === id ? { ...recipe, menuItemId: id } : r
      ));
    }
  };

  const handleDeleteMenuItem = (id: string) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
    setRecipes(recipes.filter(recipe => recipe.menuItemId !== id));
  };

  const handleEditEvent = (updatedEvent: Event) => {
    setEvents(events.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    ));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Utensils className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">
                  Catering Manager
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('calendar')}
                className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'calendar'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <CalendarDays className="inline-block mr-2" size={16} />
                Calendar View
              </button>
              <button
                onClick={() => setActiveTab('newEvent')}
                className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'newEvent'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <PlusCircle className="inline-block mr-2" size={16} />
                New Event
              </button>
              <button
                onClick={() => setActiveTab('management')}
                className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'management'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Settings className="inline-block mr-2" size={16} />
                Management
              </button>
            </nav>
          </div>
        </div>

        <div className="mt-6">
          {activeTab === 'calendar' && (
            <Calendar 
              events={events} 
              recipes={recipes}
              menuItems={menuItems}
              onEventEdit={handleEditEvent}
            />
          )}
          {activeTab === 'newEvent' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-6">Create New Event</h2>
              <NewEventForm menuItems={menuItems} onSubmit={handleNewEvent} />
            </div>
          )}
          {activeTab === 'management' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <FoodItemManager
                menuItems={menuItems}
                recipes={recipes}
                onAddItem={handleAddMenuItem}
                onEditItem={handleEditMenuItem}
                onDeleteItem={handleDeleteMenuItem}
              />
            </div>
          )}
        </div>
      </div>

      <Chatbot />
    </div>
  );
}

export default App;