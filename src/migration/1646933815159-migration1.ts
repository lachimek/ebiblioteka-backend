import {MigrationInterface, QueryRunner} from "typeorm";

export class migration11646933815159 implements MigrationInterface {
    name = 'migration11646933815159'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "genre" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "UQ_dd8cd9e50dd049656e4be1f7e8c" UNIQUE ("name"), CONSTRAINT "PK_0285d4f1655d080cfcf7d1ab141" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "language" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "language" character varying NOT NULL, CONSTRAINT "UQ_0240b556e1ee8e6e571a32ecf41" UNIQUE ("language"), CONSTRAINT "PK_cc0a99e710eb3733f6fb42b1d4c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "publisher" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "UQ_9dc496f2e5b912da9edd2aa4455" UNIQUE ("name"), CONSTRAINT "PK_70a5936b43177f76161724da3e6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "book" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isbn" character varying NOT NULL, "title" character varying NOT NULL, "publication_date" TIMESTAMP NOT NULL, "description" character varying NOT NULL DEFAULT '', "available" boolean NOT NULL DEFAULT true, "deleted" boolean NOT NULL DEFAULT false, "languageId" uuid, "publisherId" uuid, "authorId" uuid, CONSTRAINT "PK_a3afef72ec8f80e6e5c310b28a4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "author" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "UQ_d3962fd11a54d87f927e84d1080" UNIQUE ("name"), CONSTRAINT "PK_5a0e79799d372fe56f2f3fa6871" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "login" character varying NOT NULL, "password" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "book_genres_genre" ("bookId" uuid NOT NULL, "genreId" uuid NOT NULL, CONSTRAINT "PK_75a197f32ed39286c5c39198ece" PRIMARY KEY ("bookId", "genreId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_31d658e0af554165f4598158c5" ON "book_genres_genre" ("bookId") `);
        await queryRunner.query(`CREATE INDEX "IDX_83bd32782d44d9db3d68c3f58c" ON "book_genres_genre" ("genreId") `);
        await queryRunner.query(`ALTER TABLE "book" ADD CONSTRAINT "FK_a1d1140264d98ba83fa11de0da1" FOREIGN KEY ("languageId") REFERENCES "language"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "book" ADD CONSTRAINT "FK_b8988524dd01b5dcb67b4b3ede7" FOREIGN KEY ("publisherId") REFERENCES "publisher"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "book" ADD CONSTRAINT "FK_66a4f0f47943a0d99c16ecf90b2" FOREIGN KEY ("authorId") REFERENCES "author"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "book_genres_genre" ADD CONSTRAINT "FK_31d658e0af554165f4598158c55" FOREIGN KEY ("bookId") REFERENCES "book"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "book_genres_genre" ADD CONSTRAINT "FK_83bd32782d44d9db3d68c3f58c1" FOREIGN KEY ("genreId") REFERENCES "genre"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "book_genres_genre" DROP CONSTRAINT "FK_83bd32782d44d9db3d68c3f58c1"`);
        await queryRunner.query(`ALTER TABLE "book_genres_genre" DROP CONSTRAINT "FK_31d658e0af554165f4598158c55"`);
        await queryRunner.query(`ALTER TABLE "book" DROP CONSTRAINT "FK_66a4f0f47943a0d99c16ecf90b2"`);
        await queryRunner.query(`ALTER TABLE "book" DROP CONSTRAINT "FK_b8988524dd01b5dcb67b4b3ede7"`);
        await queryRunner.query(`ALTER TABLE "book" DROP CONSTRAINT "FK_a1d1140264d98ba83fa11de0da1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_83bd32782d44d9db3d68c3f58c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_31d658e0af554165f4598158c5"`);
        await queryRunner.query(`DROP TABLE "book_genres_genre"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "author"`);
        await queryRunner.query(`DROP TABLE "book"`);
        await queryRunner.query(`DROP TABLE "publisher"`);
        await queryRunner.query(`DROP TABLE "language"`);
        await queryRunner.query(`DROP TABLE "genre"`);
    }

}
