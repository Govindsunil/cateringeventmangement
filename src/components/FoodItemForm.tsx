import React, { useState } from 'react';
import { Plus, Minus, Save } from 'lucide-react';
import type { FoodItem } from '../types';

interface FoodItemFormProps {
  onSave: (foodItem: Omit<FoodItem, 'id'>) => void;
}

export default function FoodItemForm({ onSave }: FoodItemFormProps) {
  const [name, setName] = useState('');
  const [recipe, setRecipe] = useState('');
  const [ingredients, setIngredients] = useState<{ ingredient: string; quantity: number; unit: string }[]>([
    { ingredient: '', quantity: 0, unit: 'kg' }
  ]);

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { ingredient: '', quantity: 0, unit: 'kg' }]);
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      recipe,
      ingredientsFor100: ingredients
    });
    setName('');
    setRecipe('');
    setIngredients([{ ingredient: '', quantity: 0, unit: 'kg' }]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
      <div>
        <label className="block text-sm font-medium text-gray-700">Food Item Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Recipe</label>
        <textarea
          value={recipe}
          onChange={(e) => setRecipe(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          rows={4}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ingredients (for 100 people)
        </label>
        {ingredients.map((ing, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Ingredient"
              value={ing.ingredient}
              onChange={(e) => {
                const newIngredients = [...ingredients];
                newIngredients[index].ingredient = e.target.value;
                setIngredients(newIngredients);
              }}
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
            <input
              type="number"
              placeholder="Quantity"
              value={ing.quantity}
              onChange={(e) => {
                const newIngredients = [...ingredients];
                newIngredients[index].quantity = Number(e.target.value);
                setIngredients(newIngredients);
              }}
              className="w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
            <select
              value={ing.unit}
              onChange={(e) => {
                const newIngredients = [...ingredients];
                newIngredients[index].unit = e.target.value;
                setIngredients(newIngredients);
              }}
              className="w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="kg">kg</option>
              <option value="g">g</option>
              <option value="l">l</option>
              <option value="ml">ml</option>
              <option value="units">units</option>
            </select>
            <button
              type="button"
              onClick={() => handleRemoveIngredient(index)}
              className="p-2 text-red-600 hover:text-red-800"
            >
              <Minus size={20} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddIngredient}
          className="mt-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus size={16} className="mr-2" /> Add Ingredient
        </button>
      </div>

      <button
        type="submit"
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <Save size={16} className="mr-2" /> Save Food Item
      </button>
    </form>
  );
}