import React from 'react';
import { MenuItem } from '../../types';

interface FoodSelectionFormProps {
  menuItems: MenuItem[];
  selectedItems: Array<{ itemId: string; quantity: number }>;
  onSelectionChange: (items: Array<{ itemId: string; quantity: number }>) => void;
}

export default function FoodSelectionForm({
  menuItems,
  selectedItems,
  onSelectionChange,
}: FoodSelectionFormProps) {
  const handleItemToggle = (itemId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedItems, { itemId, quantity: 1 }]);
    } else {
      onSelectionChange(selectedItems.filter(item => item.itemId !== itemId));
    }
  };

  const handleQuantityChange = (itemId: string, quantity: number) => {
    onSelectionChange(
      selectedItems.map(item =>
        item.itemId === itemId ? { ...item, quantity } : item
      )
    );
  };

  const renderFoodSection = (category: MenuItem['category'], title: string) => {
    const items = menuItems.filter(item => item.category === category);
    if (items.length === 0) return null;

    return (
      <div key={category} className="space-y-2">
        <h4 className="font-medium text-gray-700">{title}</h4>
        <div className="space-y-2">
          {items.map(item => (
            <div key={item.id} className="flex items-center space-x-4">
              <input
                type="checkbox"
                checked={selectedItems.some(i => i.itemId === item.id)}
                onChange={(e) => handleItemToggle(item.id, e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <div className="flex-1">
                <div className="font-medium">{item.name}</div>
                <div className="text-sm text-gray-500">{item.description}</div>
                <div className="flex gap-2 mt-1">
                  {item.isVegetarian && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      Vegetarian
                    </span>
                  )}
                  {item.category === 'combo' && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                      Combo Meal
                    </span>
                  )}
                </div>
              </div>
              {selectedItems.some(i => i.itemId === item.id) && (
                <input
                  type="number"
                  min="1"
                  value={selectedItems.find(i => i.itemId === item.id)?.quantity || 1}
                  onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                  className="w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Select Menu Items</h3>
      
      {/* Combo Meals Section */}
      {renderFoodSection('combo', 'Combo Meals')}
      
      {/* Individual Items Sections */}
      {renderFoodSection('appetizer', 'Appetizers')}
      {renderFoodSection('mainCourse', 'Main Course')}
      {renderFoodSection('dessert', 'Desserts')}
      {renderFoodSection('beverage', 'Beverages')}
    </div>
  );
}