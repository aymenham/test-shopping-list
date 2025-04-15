import { FOOD_CATEGORY, FOOD_TAG } from "../Types/FoodTag";
import { Ingredient } from "../Types/Ingredient";
import { Recipe } from "../Types/Recipe";

type ValidationResult = true | string;
type InvalidRecipeMessage = {
  recipeName: string;
  issues: string[];
};

export function validateRecipeIngredients(
  selectedIngredients: Ingredient[],
  foodTags: FOOD_TAG[],
  allRecipes: Recipe[]
): ValidationResult {
  const proteinTag = foodTags.find(
    (tag) => tag.name.toLowerCase() === FOOD_CATEGORY.PROTEIN
  );
  const feculentTag = foodTags.find(
    (tag) => tag.name.toLowerCase() === FOOD_CATEGORY.STARCH
  );
  const vegetableTag = foodTags.find(
    (tag) => tag.name.toLowerCase() === FOOD_CATEGORY.VEGETABLE
  );

  if (!proteinTag || !feculentTag || !vegetableTag) {
    return "Food tag mapping failed. Please make sure 'protein', 'feculent', and 'vegetable' tags exist.";
  }

  const proteinTagId = proteinTag.id;
  const feculentTagId = feculentTag.id;

  let proteinCount = 0;
  let feculentCount = 0;
  const selectedProteinIds: number[] = [];

  for (const ingredient of selectedIngredients) {
    if (ingredient.foodTagId === proteinTagId) {
      proteinCount++;
      selectedProteinIds.push(ingredient.id);
    }
    if (ingredient.foodTagId === feculentTagId) {
      feculentCount++;
    }
  }

  // check if there is no more than one protein
  if (proteinCount > 1) {
    return "A recipe can have at most one protein.";
  }
  // check if thre at least ine stratch
  if (feculentCount !== 1) {
    return "A recipe must have exactly one starch .";
  }

  // check if one protein exist only in one receipe
  for (const recipe of allRecipes) {
    for (const existing of recipe.ingredients) {
      if (selectedProteinIds.includes(existing.id)) {
        return `The protein "${existing.name}" already appears in the recipe "${recipe.name}". Please remove it from this recipe.`;
      }
    }
  }

  return true;
}

export function getInvalidRecipesAfterTagUpdate(
  updatedIngredients: Ingredient[],
  recipes: Recipe[],
  foodTags: FOOD_TAG[]
): InvalidRecipeMessage[] {
  const tagById = Object.fromEntries(
    foodTags.map((tag) => [tag.id, tag.name.toLowerCase()])
  );

  const proteinTagId = foodTags.find(
    (tag) => tag.name.toLowerCase() === FOOD_CATEGORY.PROTEIN
  )?.id;
  const feculentTagId = foodTags.find(
    (tag) => tag.name.toLowerCase() === FOOD_CATEGORY.STARCH
  )?.id;

  if (!proteinTagId || !feculentTagId) {
    console.warn("Missing 'protein' or 'feculent' tag in foodTags.");
    return [];
  }

  const result: InvalidRecipeMessage[] = [];

  for (const recipe of recipes) {
    const issues: string[] = [];

    const recipeIngredients = recipe.ingredients.map((ing) => {
      return updatedIngredients.find((updated) => updated.id === ing.id) || ing;
    });

    const proteins = recipeIngredients.filter(
      (ing) => ing.foodTagId === proteinTagId
    );
    const feculents = recipeIngredients.filter(
      (ing) => ing.foodTagId === feculentTagId
    );

    // Rule 1: Protein count
    if (proteins.length > 1) {
      issues.push(
        `Too many proteins in recipe: [${proteins
          .map((p) => `"${p.name}"`)
          .join(", ")}]`
      );
    }

    if (feculents.length !== 1) {
      issues.push(
        `This recipe must have exactly one starch, currently it has ${feculents.length}.`
      );
    }

    for (const protein of proteins) {
      for (const other of recipes) {
        if (other.id === recipe.id) continue;

        const found = other.ingredients.find((i) => i.id === protein.id);
        if (found) {
          issues.push(
            `Protein "${protein.name}" also appears in recipe "${other.name}". Proteins must appear in only one recipe.`
          );
        }
      }
    }

    for (const original of recipe.ingredients) {
      const updated = updatedIngredients.find((u) => u.id === original.id);
      if (updated && updated.foodTagId !== original.foodTagId) {
        const from = tagById[original.foodTagId] ?? "unknown";
        const to = tagById[updated.foodTagId] ?? "unknown";
        issues.push(
          `Ingredient "${updated.name}" changed from tag "${from}" to "${to}".`
        );
      }
    }

    if (issues.length > 0) {
      result.push({ recipeName: recipe.name, issues });
    }
  }

  return result;
}
