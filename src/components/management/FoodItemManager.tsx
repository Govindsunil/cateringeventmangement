import React, { useState } from 'react';
import { Plus, Edit, Trash } from 'lucide-react';
import { MenuItem, Recipe } from '../../types';
import FoodItemForm from './FoodItemForm';
import ComboMealForm from './ComboMealForm';

interface FoodItemManagerProps {
  menuItems: MenuItem[];
  recipes: Recipe[];
  onAddItem: (item: MenuItem, recipe?: Recipe) => void;
  onEditItem: (id: string, item: MenuItem, recipe?: Recipe) => void;
  onDeleteItem: (id: string) => void;
}

export default function FoodItemManager({
  menuItems,
  recipes,
  onAddItem,
  onEditItem,
  onDeleteItem,
}: FoodItemManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formType, setFormType] = useState<'individual' | 'combo'>('individual');

  const getRecipeForItem = (itemId: string) => {
    return recipes.find(recipe => recipe.menuItemId === itemId) || null;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Menu Items Management</h2>
        <div className="space-x-2">
          <button
            onClick={() => {
              setFormType('individual');
              setShowForm(true);
              setEditingItem(null);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Food Item
          </button>
          <button
            onClick={() => {
              setFormType('combo');
              setShowForm(true);
              setEditingItem(null);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Combo
          </button>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {formType === 'individual' ? (
              <FoodItemForm
                initialData={editingItem}
                initialRecipe={editingItem ? getRecipeForItem(editingItem.id) : null}
                onSubmit={(item, recipe) => {
                  if (editingItem) {
                    onEditItem(editingItem.id, item, recipe);
                  } else {
                    onAddItem(item, recipe);
                  }
                  setShowForm(false);
                }}
                onCancel={() => setShowForm(false)}
              />
            ) : (
              <ComboMealForm
                menuItems={menuItems}
                onSubmit={(combo) => {
                  onAddItem(combo);
                  setShowForm(false);
                }}
                onCancel={() => setShowForm(false)}
              />
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.description}</p>
                <p className="text-sm font-medium mt-1">${item.price}</p>
                {item.isVegetarian && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 mt-1">
                    Vegetarian
                  </span>
                )}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setEditingItem(item);
                    setFormType('individual');
                    setShowForm(true);
                  }}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDeleteItem(item.id)}
                  className="p-1 text-gray-400 hover:text-red-600"
                >
                  <Trash className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}