import React, { useState, useEffect } from 'react';
import { MenuItem, Recipe } from '../../types';

interface FoodItemFormProps {
  initialData?: MenuItem | null;
  initialRecipe?: Recipe | null;
  onSubmit: (item: MenuItem, recipe?: Recipe) => void;
  onCancel: () => void;
}

export default function FoodItemForm({
  initialData,
  initialRecipe,
  onSubmit,
  onCancel,
}: FoodItemFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [category, setCategory] = useState<MenuItem['category']>(initialData?.category || 'mainCourse');
  const [price, setPrice] = useState(initialData?.price?.toString() || '');
  const [isVegetarian, setIsVegetarian] = useState(initialData?.isVegetarian || false);
  const [allergens, setAllergens] = useState<string[]>(initialData?.allergens || []);
  const [recipe, setRecipe] = useState(initialRecipe?.instructions || '');
  const [ingredients, setIngredients] = useState<Recipe['ingredients']>(
    initialRecipe?.ingredients || []
  );

  // Initialize ingredients from existing recipe when editing
  useEffect(() => {
    if (initialRecipe?.ingredients) {
      setIngredients(initialRecipe.ingredients);
    }
  }, [initialRecipe]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const menuItem: MenuItem = {
      id: initialData?.id || crypto.randomUUID(),
      name,
      description,
      category,
      price: parseFloat(price),
      isVegetarian,
      allergens,
    };

    const recipeData: Recipe | undefined = recipe || ingredients.length > 0
      ? {
          id: initialRecipe?.id || crypto.randomUUID(),
          menuItemId: menuItem.id,
          name: menuItem.name,
          instructions: recipe,
          ingredients: ingredients.filter(ing => ing.name && ing.quantity > 0),
        }
      : undefined;

    onSubmit(menuItem, recipeData);
  };

  const handleAddIngredient = () => {
    setIngredients([
      ...ingredients,
      { name: '', quantity: 0, unit: 'kg' },
    ]);
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleIngredientChange = (
    index: number,
    field: keyof Recipe['ingredients'][0],
    value: string | number
  ) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = {
      ...newIngredients[index],
      [field]: field === 'quantity' ? Number(value) : value,
    };
    setIngredients(newIngredients);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description *</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          rows={3}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Category *</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as MenuItem['category'])}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        >
          <option value="appetizer">Appetizer</option>
          <option value="mainCourse">Main Course</option>
          <option value="dessert">Dessert</option>
          <option value="beverage">Beverage</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Price *</label>
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
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isVegetarian}
            onChange={(e) => setIsVegetarian(e.target.checked)}
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="text-sm font-medium text-gray-700">Vegetarian</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Allergens</label>
        <div className="space-y-2">
          {['dairy', 'nuts', 'gluten', 'soy', 'shellfish'].map((allergen) => (
            <label key={allergen} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={allergens.includes(allergen)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setAllergens([...allergens, allergen]);
                  } else {
                    setAllergens(allergens.filter((a) => a !== allergen));
                  }
                }}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700 capitalize">{allergen}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Recipe Instructions</label>
        <textarea
          value={recipe}
          onChange={(e) => setRecipe(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          rows={4}
          placeholder="Enter cooking instructions..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ingredients (for 100 people)
        </label>
        {ingredients.map((ingredient, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Ingredient name"
              value={ingredient.name}
              onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <input
              type="number"
              step="0.01"
              placeholder="Quantity"
              value={ingredient.quantity}
              onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
              className="w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <select
              value={ingredient.unit}
              onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
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
              className="px-2 py-1 text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddIngredient}
          className="mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Add Ingredient
        </button>
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
          {initialData ? 'Update' : 'Create'} Item
        </button>
      </div>
    </form>
  );
}