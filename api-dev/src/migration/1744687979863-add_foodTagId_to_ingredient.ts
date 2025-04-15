import { MigrationInterface, QueryRunner } from "typeorm";

export class addFoodTagIdToIngredient1624451234567
  implements MigrationInterface
{
  name = "addFoodTagIdToIngredient1624451234567";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "ingredient"
      ADD "foodTagId" integer;
    `);

    await queryRunner.query(`
      ALTER TABLE "ingredient"
      ADD CONSTRAINT "FK_ingredient_foodTag" FOREIGN KEY ("foodTagId") REFERENCES "food_tag"("id") ON DELETE SET NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "ingredient" DROP CONSTRAINT "FK_ingredient_foodTag";
    `);

    await queryRunner.query(`
      ALTER TABLE "ingredient" DROP COLUMN "foodTagId";
    `);
  }
}
