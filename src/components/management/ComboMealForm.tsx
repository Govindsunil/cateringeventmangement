import React, { useState } from 'react';
import { MenuItem } from '../../types';

interface ComboMealFormProps {
  menuItems: MenuItem[];
  onSubmit: (combo: MenuItem) => void;
  onCancel: () => void;
}

export default function ComboMealForm({
  menuItems,
  onSubmit,
  onCancel,
}: ComboMealFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const combo: MenuItem = {
      id: crypto.randomUUID(),
      name,
      description,
      category: 'combo',
      price: parseFloat(price),
      isVegetarian: selectedItems.every(id => 
        menuItems.find(item => item.id === id)?.isVegetarian
      ),
      allergens: Array.from(new Set(
        selectedItems.flatMap(id => 
          menuItems.find(item => item.id === id)?.allergens || []
        )
      )),
    };

    onSubmit(combo);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Combo Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          rows={3}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Price</label>
        <input
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Items</label>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {menuItems.filter(item => item.category !== 'combo').map((item) => (
            <label key={item.id} className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={selectedItems.includes(item.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedItems([...selectedItems, item.id]);
                  } else {
                    setSelectedItems(selectedItems.filter(id => id !== item.id));
                  }
                }}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span>{item.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Create Combo
        </button>
      </div>
    </form>
  );
}