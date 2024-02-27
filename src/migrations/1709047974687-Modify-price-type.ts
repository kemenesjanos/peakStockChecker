import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyPriceType1709047974687 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "stock_price"
      ALTER COLUMN "price" TYPE REAL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "stock_price"
      ALTER COLUMN "price" TYPE INTEGER
    `);
  }
}
