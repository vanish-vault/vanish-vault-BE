import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1774977205112 implements MigrationInterface {
    name = 'InitialMigration1774977205112'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying NOT NULL DEFAULT 'SYSTEM', "updated_by" character varying NOT NULL DEFAULT 'SYSTEM', "name" character varying, "username" character varying NOT NULL, "email" character varying NOT NULL, "razorpay_customer_id" character varying, "email_verified" boolean NOT NULL, "image" character varying, "display_username" character varying, "role" character varying DEFAULT 'user', "banned" boolean DEFAULT false, "ban_reason" character varying, "ban_expires" TIMESTAMP, "invite_code_used" character varying, "two_factor_enabled" boolean DEFAULT false, "monthly_file_uploads" integer NOT NULL DEFAULT '0', "file_upload_month_year" character varying(7), "planId" uuid, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "secrets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying NOT NULL DEFAULT 'SYSTEM', "updated_by" character varying NOT NULL DEFAULT 'SYSTEM', "secret" bytea NOT NULL, "title" bytea, "views" integer NOT NULL DEFAULT '1', "max_views" integer NOT NULL DEFAULT '1', "password" character varying, "salt" character varying, "is_burnable" boolean NOT NULL DEFAULT false, "expires_at" TIMESTAMP NOT NULL, "ip_range" character varying DEFAULT '', "userId" uuid, CONSTRAINT "PK_d4ff48ddba1883d4dc142b9c697" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1b0577a50d876399e44446a105" ON "secrets" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_28d272d5f2a8e37af5d771796e" ON "secrets" ("expires_at") `);
        await queryRunner.query(`CREATE TABLE "files" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying NOT NULL DEFAULT 'SYSTEM', "updated_by" character varying NOT NULL DEFAULT 'SYSTEM', "filename" character varying NOT NULL, "original_filename" character varying NOT NULL, "file_full_path" character varying NOT NULL, "path" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'pending', "file_size" integer NOT NULL, "content_type" character varying NOT NULL, CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "session" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying NOT NULL DEFAULT 'SYSTEM', "updated_by" character varying NOT NULL DEFAULT 'SYSTEM', "expires_at" TIMESTAMP NOT NULL, "token" character varying NOT NULL, "ip_address" character varying, "user_agent" character varying, "user_id" character varying NOT NULL, "userId" uuid, CONSTRAINT "UQ_232f8e85d7633bd6ddfad421696" UNIQUE ("token"), CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "account" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying NOT NULL DEFAULT 'SYSTEM', "updated_by" character varying NOT NULL DEFAULT 'SYSTEM', "account_id" character varying NOT NULL, "provider_id" character varying NOT NULL, "user_id" character varying NOT NULL, "access_token" character varying, "refresh_token" character varying, "id_token" character varying, "access_token_expires_at" TIMESTAMP, "refresh_token_expires_at" TIMESTAMP, "scope" character varying, "password" character varying, "userId" uuid, CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "plans" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying NOT NULL DEFAULT 'SYSTEM', "updated_by" character varying NOT NULL DEFAULT 'SYSTEM', "name" character varying(255) NOT NULL, "description" character varying(255) NOT NULL, "razorpay_plan_id" character varying(255) NOT NULL, "price" integer NOT NULL, "max_secrets" integer NOT NULL, "max_files" integer NOT NULL, "max_views" integer NOT NULL, "max_file_size" integer NOT NULL, "max_file_count" integer NOT NULL, "max_expiry" integer NOT NULL DEFAULT '86400', "encryption_type" character varying(255) NOT NULL DEFAULT 'Basic AES-256 encryption', "has_password_protection" boolean NOT NULL DEFAULT true, "support_type" character varying(255) NOT NULL DEFAULT 'Email support', "has_qr_code" boolean NOT NULL DEFAULT true, "is_most_popular" boolean NOT NULL DEFAULT false, "interval" character varying(50) NOT NULL DEFAULT 'month', "features" jsonb NOT NULL DEFAULT '[]', CONSTRAINT "PK_3720521a81c7c24fe9b7202ba61" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "webhooks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying NOT NULL DEFAULT 'SYSTEM', "updated_by" character varying NOT NULL DEFAULT 'SYSTEM', "event" character varying NOT NULL, "payload" json NOT NULL, CONSTRAINT "PK_9e8795cfc899ab7bdaa831e8527" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "secret_files" ("secretsId" uuid NOT NULL, "filesId" uuid NOT NULL, CONSTRAINT "PK_0aebeb98a137ed647b9d4adb444" PRIMARY KEY ("secretsId", "filesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_16fdb9db5813e3ad972f504949" ON "secret_files" ("secretsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_84c74e8a9887290194d9374b17" ON "secret_files" ("filesId") `);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_40f6ab3925c167d26e52db93cf0" FOREIGN KEY ("planId") REFERENCES "plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "secrets" ADD CONSTRAINT "FK_1b0577a50d876399e44446a105d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "session" ADD CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "account" ADD CONSTRAINT "FK_60328bf27019ff5498c4b977421" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "secret_files" ADD CONSTRAINT "FK_16fdb9db5813e3ad972f5049495" FOREIGN KEY ("secretsId") REFERENCES "secrets"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "secret_files" ADD CONSTRAINT "FK_84c74e8a9887290194d9374b173" FOREIGN KEY ("filesId") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "secret_files" DROP CONSTRAINT "FK_84c74e8a9887290194d9374b173"`);
        await queryRunner.query(`ALTER TABLE "secret_files" DROP CONSTRAINT "FK_16fdb9db5813e3ad972f5049495"`);
        await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "FK_60328bf27019ff5498c4b977421"`);
        await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53"`);
        await queryRunner.query(`ALTER TABLE "secrets" DROP CONSTRAINT "FK_1b0577a50d876399e44446a105d"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_40f6ab3925c167d26e52db93cf0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_84c74e8a9887290194d9374b17"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_16fdb9db5813e3ad972f504949"`);
        await queryRunner.query(`DROP TABLE "secret_files"`);
        await queryRunner.query(`DROP TABLE "webhooks"`);
        await queryRunner.query(`DROP TABLE "plans"`);
        await queryRunner.query(`DROP TABLE "account"`);
        await queryRunner.query(`DROP TABLE "session"`);
        await queryRunner.query(`DROP TABLE "files"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_28d272d5f2a8e37af5d771796e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1b0577a50d876399e44446a105"`);
        await queryRunner.query(`DROP TABLE "secrets"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
