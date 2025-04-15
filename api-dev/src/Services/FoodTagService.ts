import { getRepository } from "typeorm";
import { FoodTag } from "../Entities/FoodTag";

export class FoodTagService {
  static async list(): Promise<FoodTag[]> {
    const tags = await getRepository(FoodTag).find();
    return tags;
  }

  static async create(tag: FoodTag): Promise<FoodTag> {
    const newTag = await getRepository(FoodTag).save(tag);
    return newTag;
  }

  static async update(tag: FoodTag): Promise<FoodTag> {
    const updatedTag = await getRepository(FoodTag).save(tag);
    return updatedTag;
  }

  static async delete(id: number): Promise<void> {
    await getRepository(FoodTag).delete(id);
  }
}
