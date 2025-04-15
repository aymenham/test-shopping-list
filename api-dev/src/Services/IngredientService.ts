import { getRepository } from "typeorm";
import { Ingredient } from "../Entities/Ingredient";
import { FoodTag } from "../Entities/FoodTag";

export class IngredientService {
  static async list(): Promise<Ingredient[]> {
    const ingredient = await getRepository(Ingredient).find();
    return ingredient;
  }

  static async create(ingredient: Ingredient): Promise<Ingredient> {
    const foodTag = await getRepository(FoodTag).findOne({
      where: { id: ingredient.foodTagId },
    });

    if (foodTag) {
      ingredient.foodTag = foodTag;
    }

    const newIngredient = await getRepository(Ingredient).save(ingredient);
    return newIngredient;
  }

  static async update(
    id: number,
    updates: Partial<Ingredient>
  ): Promise<Ingredient> {
    const repo = getRepository(Ingredient);

    const ingredient = await repo.findOne({ where: { id } });
    if (!ingredient) {
      throw new Error("Ingredient not found");
    }

    const updated = Object.assign(ingredient, updates);
    return await repo.save(updated);
  }

  static async delete(id: number): Promise<void> {
    await getRepository(Ingredient).delete(id);
  }
}
