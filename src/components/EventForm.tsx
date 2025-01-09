import React, { useState } from 'react';
import { Calendar, Clock, Users, Save } from 'lucide-react';
import type { FoodItem } from '../types';

interface EventFormProps {
  foodItems: FoodItem[];
  onSave: (event: {
    title: string;
    date: string;
    time: string;
    guestCount: number;
    selectedFoodItems: { foodItemId: string; quantity: number; }[];
  }) => void;
}

export default function EventForm({ foodItems, onSave }: EventFormProps) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guestCount, setGuestCount] = useState(0);
  const [selectedFoods, setSelectedFoods] = useState<{ foodItemId: string; quantity: number; }[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      date,
      time,
      guestCount,
      selectedFoodItems: selectedFoods
    });
    setTitle('');
    setDate('');
    setTime('');
    setGuestCount(0);
    setSelectedFoods([]);
  };

  const handleFoodSelection = (foodId: string, checked: boolean) => {
    if (checked) {
      setSelectedFoods([...selectedFoods, { foodItemId: foodId, quantity: 1 }]);
    } else {
      setSelectedFoods(selectedFoods.filter(food => food.foodItemId !== foodId));
    }
  };

  const handleQuantityChange = (foodId: string, quantity: number) => {
    setSelectedFoods(selectedFoods.map(food => 
      food.foodItemId === foodId ? { ...food, quantity } : food
    ));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
      <div>
        <label className="block text-sm font-medium text-gray-700">Event Title</label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="block w-full rounded-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Time</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="block w-full rounded-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Clock className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Number of Guests</label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <input
            type="number"
            min="1"
            value={guestCount}
            onChange={(e) => setGuestCount(Number(e.target.value))}
            className="block w-full rounded-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Users className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Food Items</label>
        <div className="space-y-2">
          {foodItems.map((food) => (
            <div key={food.id} className="flex items-center space-x-4">
              <input
                type="checkbox"
                checked={selectedFoods.some(f => f.foodItemId === food.id)}
                onChange={(e) => handleFoodSelection(food.id, e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="flex-1">{food.name}</span>
              {selectedFoods.some(f => f.foodItemId === food.id) && (
                <input
                  type="number"
                  min="1"
                  value={selectedFoods.find(f => f.foodItemId === food.id)?.quantity || 1}
                  onChange={(e) => handleQuantityChange(food.id, Number(e.target.value))}
                  className="w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <Save size={16} className="mr-2" /> Save Event
      </button>
    </form>
  );
}