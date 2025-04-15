import { MigrationInterface, QueryRunner } from "typeorm";

export class insertDefaultFoodTags1744680582158 implements MigrationInterface {
  name = "insertDefaultFoodTags1744680582158";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "food_tag" ("name") VALUES
        ('vegetable'),
        ('protein'),
        ('starch')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM "food_tag" WHERE "name" IN ('vegetable', 'protein', 'starch')
    `);
  }
}
