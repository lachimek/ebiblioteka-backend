import {MigrationInterface, QueryRunner} from "typeorm";

export class migration21648425097586 implements MigrationInterface {
    name = 'migration21648425097586'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "group" DROP CONSTRAINT "FK_c3ba3917c9815e2001c5f19c3f3"`);
        await queryRunner.query(`ALTER TABLE "group" DROP COLUMN "detailsId"`);
        await queryRunner.query(`ALTER TABLE "user_details" ADD "groupId" uuid`);
        await queryRunner.query(`ALTER TABLE "user_details" ADD CONSTRAINT "FK_88e458d87409854029b830cabfa" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_details" DROP CONSTRAINT "FK_88e458d87409854029b830cabfa"`);
        await queryRunner.query(`ALTER TABLE "user_details" DROP COLUMN "groupId"`);
        await queryRunner.query(`ALTER TABLE "group" ADD "detailsId" uuid`);
        await queryRunner.query(`ALTER TABLE "group" ADD CONSTRAINT "FK_c3ba3917c9815e2001c5f19c3f3" FOREIGN KEY ("detailsId") REFERENCES "user_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
