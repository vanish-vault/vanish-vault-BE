import { MigrationInterface, QueryRunner } from "typeorm";

export class SyncUserIdConstraints1775396524487 implements MigrationInterface {
    name = 'SyncUserIdConstraints1775396524487'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Drop existing constraints from potentially redundant columns
        await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT IF EXISTS "FK_3d2f174ef04fb312fdebd0ddc53"`);
        await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT IF EXISTS "FK_60328bf27019ff5498c4b977421"`);

        // 2. Drop the redundant implicit columns created due to naming mismatch
        await queryRunner.query(`ALTER TABLE "session" DROP COLUMN IF EXISTS "userId"`);
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN IF EXISTS "userId"`);

        // 3. Convert existing user_id column from string to uuid safely (Postgres requires USING)
        await queryRunner.query(`ALTER TABLE "session" ALTER COLUMN "user_id" TYPE uuid USING ("user_id"::uuid)`);
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "user_id" TYPE uuid USING ("user_id"::uuid)`);

        // 4. Ensure non-nullability
        await queryRunner.query(`ALTER TABLE "session" ALTER COLUMN "user_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "user_id" SET NOT NULL`);

        // 5. Create new foreign key constraints on the consistent column name
        await queryRunner.query(`ALTER TABLE "session" ADD CONSTRAINT "FK_30e98e8746699fb9af235410aff" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "account" ADD CONSTRAINT "FK_efef1e5fdbe318a379c06678c51" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Note: Reversing this perfectly is complex, but re-adding the column is standard
        await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "FK_efef1e5fdbe318a379c06678c51"`);
        await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "FK_30e98e8746699fb9af235410aff"`);
        
        await queryRunner.query(`ALTER TABLE "session" ALTER COLUMN "user_id" TYPE character varying`);
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "user_id" TYPE character varying`);
        
        await queryRunner.query(`ALTER TABLE "session" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "account" ADD "userId" uuid`);
    }

}
