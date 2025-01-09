import React from 'react';

interface DietaryFormProps {
  dietaryRestrictions: string[];
  allergenInfo: string[];
  onDietaryChange: (restrictions: string[]) => void;
  onAllergenChange: (allergens: string[]) => void;
}

export default function DietaryForm({
  dietaryRestrictions,
  allergenInfo,
  onDietaryChange,
  onAllergenChange,
}: DietaryFormProps) {
  const dietaryOptions = [
    'Vegetarian',
    'Vegan',
    'Gluten-Free',
    'Dairy-Free',
    'Halal',
    'Kosher',
  ];

  const allergenOptions = [
    'Nuts',
    'Dairy',
    'Eggs',
    'Soy',
    'Wheat',
    'Fish',
    'Shellfish',
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-gray-700">Dietary Restrictions</h3>
        <div className="mt-2 space-y-2">
          {dietaryOptions.map(option => (
            <label key={option} className="inline-flex items-center mr-4">
              <input
                type="checkbox"
                checked={dietaryRestrictions.includes(option)}
                onChange={(e) => {
                  if (e.target.checked) {
                    onDietaryChange([...dietaryRestrictions, option]);
                  } else {
                    onDietaryChange(dietaryRestrictions.filter(r => r !== option));
                  }
                }}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-700">Allergen Information</h3>
        <div className="mt-2 space-y-2">
          {allergenOptions.map(option => (
            <label key={option} className="inline-flex items-center mr-4">
              <input
                type="checkbox"
                checked={allergenInfo.includes(option)}
                onChange={(e) => {
                  if (e.target.checked) {
                    onAllergenChange([...allergenInfo, option]);
                  } else {
                    onAllergenChange(allergenInfo.filter(a => a !== option));
                  }
                }}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}