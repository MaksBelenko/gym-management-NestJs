import {MigrationInterface, QueryRunner} from "typeorm";

export class EntitiesChange1614202598362 implements MigrationInterface {
    name = 'EntitiesChange1614202598362'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "gym_session" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "gym_session" ADD "maxNumberOfPlaces" integer NOT NULL DEFAULT '12'`);
        await queryRunner.query(`ALTER TABLE "gym_session" ADD "bookedPlaces" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "gym_session" DROP COLUMN "bookedPlaces"`);
        await queryRunner.query(`ALTER TABLE "gym_session" DROP COLUMN "maxNumberOfPlaces"`);
        await queryRunner.query(`ALTER TABLE "gym_session" ADD "status" character varying NOT NULL`);
    }

}
