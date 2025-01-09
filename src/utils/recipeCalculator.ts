import { Recipe } from '../types';

export function calculateIngredientsForPeople(recipe: Recipe, peopleCount: number): Recipe['ingredients'] {
  const scaleFactor = peopleCount / 100; // Recipe is based on 100 people
  return recipe.ingredients.map(ingredient => ({
    ...ingredient,
    quantity: Number((ingredient.quantity * scaleFactor).toFixed(2)) // Round to 2 decimal places
  }));
}

export function generateShoppingList(recipes: Recipe[], peopleCount: number): string {
  let shoppingList = `Shopping List for ${peopleCount} people\n`;
  shoppingList += `Generated on ${new Date().toLocaleDateString()}\n\n`;

  // Group ingredients by unit for better organization
  const groupedIngredients: Record<string, { name: string; quantity: number; unit: string }[]> = {};

  recipes.forEach(recipe => {
    const scaledIngredients = calculateIngredientsForPeople(recipe, peopleCount);
    scaledIngredients.forEach(ingredient => {
      if (!groupedIngredients[ingredient.unit]) {
        groupedIngredients[ingredient.unit] = [];
      }
      
      // Check if ingredient already exists
      const existingIngredient = groupedIngredients[ingredient.unit].find(
        item => item.name.toLowerCase() === ingredient.name.toLowerCase()
      );

      if (existingIngredient) {
        existingIngredient.quantity += ingredient.quantity;
      } else {
        groupedIngredients[ingredient.unit].push({
          name: ingredient.name,
          quantity: ingredient.quantity,
          unit: ingredient.unit
        });
      }
    });
  });

  // Add ingredients by unit group
  Object.entries(groupedIngredients).forEach(([unit, ingredients]) => {
    shoppingList += `\n${unit.toUpperCase()}:\n`;
    ingredients
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach(ingredient => {
        shoppingList += `- ${ingredient.name}: ${ingredient.quantity} ${ingredient.unit}\n`;
      });
  });

  return shoppingList;
}

export function downloadShoppingList(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}