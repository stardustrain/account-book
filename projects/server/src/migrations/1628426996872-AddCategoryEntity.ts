import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddCategoryEntity1628426996872 implements MigrationInterface {
  name = 'AddCategoryEntity1628426996872'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "category_categorytype_enum" AS ENUM('INCOME', 'OUTCOME')`)
    await queryRunner.query(
      `CREATE TABLE "category" ("id" SERIAL NOT NULL, "categoryType" "category_categorytype_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "category"`)
    await queryRunner.query(`DROP TYPE "category_categorytype_enum"`)
  }
}
