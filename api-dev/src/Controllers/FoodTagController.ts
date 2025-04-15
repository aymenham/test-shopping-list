import { FoodTagService } from "../Services/FoodTagService";

export class FoodTagController {
  public static async list(req: any, res: any, next: any): Promise<void> {
    try {
      const tags = await FoodTagService.list();
      res.send(tags);
    } catch (err) {
      console.error("[FoodTagController.list] Error listing food tags", err);
      res.send(500);
    }
  }

  public static async create(req: any, res: any, next: any): Promise<void> {
    try {
      const tag = await FoodTagService.create(req.body);
      res.send(tag);
    } catch (err) {
      console.error("[FoodTagController.create] Error creating food tag", err);
      res.send(500);
    }
  }

  public static async update(req: any, res: any, next: any): Promise<void> {
    try {
      const tag = await FoodTagService.update(req.body);
      res.send(tag);
    } catch (err) {
      console.error("[FoodTagController.update] Error updating food tag", err);
      res.send(500);
    }
  }

  public static async delete(req: any, res: any, next: any): Promise<void> {
    try {
      await FoodTagService.delete(req.params.id);
      res.send();
    } catch (err) {
      console.error("[FoodTagController.delete] Error deleting food tag", err);
      res.send(500);
    }
  }
}
