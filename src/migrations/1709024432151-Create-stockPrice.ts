import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateStockPrice1709024432151 implements MigrationInterface {
  name = "CreateStockPrice1709024432151";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "stock_price"
      (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "symbol" character varying NOT NULL, "price" integer NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_a363478dafdfed1814c9b0b97fd" PRIMARY KEY ("id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "stock_price"`);
  }
}
