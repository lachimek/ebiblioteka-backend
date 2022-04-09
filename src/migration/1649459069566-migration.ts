import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1649459069566 implements MigrationInterface {
    name = 'migration1649459069566'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "genre" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "UQ_dd8cd9e50dd049656e4be1f7e8c" UNIQUE ("name"), CONSTRAINT "PK_0285d4f1655d080cfcf7d1ab141" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "group" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_256aa0fda9b1de1a73ee0b7106b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_details" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "email" character varying NOT NULL, "phone" character varying NOT NULL, "city" character varying NOT NULL, "postal_code" character varying NOT NULL, "street_address" character varying NOT NULL, "groupId" uuid, CONSTRAINT "PK_fb08394d3f499b9e441cab9ca51" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('admin', 'worker', 'student')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "login" character varying NOT NULL, "password" character varying NOT NULL, "role" "public"."user_role_enum" NOT NULL DEFAULT 'student', "userDetailsId" uuid, CONSTRAINT "REL_51dabb934475afa077f62c116c" UNIQUE ("userDetailsId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "issue_history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "issue_date" TIMESTAMP NOT NULL, "return_date" TIMESTAMP NOT NULL, "bookId" uuid, "memberId" uuid, CONSTRAINT "PK_8d7c181a50733c19289c25a838b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "language" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "language" character varying NOT NULL, CONSTRAINT "UQ_0240b556e1ee8e6e571a32ecf41" UNIQUE ("language"), CONSTRAINT "PK_cc0a99e710eb3733f6fb42b1d4c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "publisher" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "UQ_9dc496f2e5b912da9edd2aa4455" UNIQUE ("name"), CONSTRAINT "PK_70a5936b43177f76161724da3e6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "book" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isbn" character varying NOT NULL, "title" character varying NOT NULL, "publication_date" TIMESTAMP NOT NULL, "description" character varying NOT NULL DEFAULT '', "available" boolean NOT NULL DEFAULT true, "deleted" boolean NOT NULL DEFAULT false, "languageId" uuid, "publisherId" uuid, "authorId" uuid, CONSTRAINT "PK_a3afef72ec8f80e6e5c310b28a4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "author" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "UQ_d3962fd11a54d87f927e84d1080" UNIQUE ("name"), CONSTRAINT "PK_5a0e79799d372fe56f2f3fa6871" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "books_amount_history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "PK_2c23cd2f3238d1ed15e20907c2d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "book_genres_genre" ("bookId" uuid NOT NULL, "genreId" uuid NOT NULL, CONSTRAINT "PK_75a197f32ed39286c5c39198ece" PRIMARY KEY ("bookId", "genreId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_31d658e0af554165f4598158c5" ON "book_genres_genre" ("bookId") `);
        await queryRunner.query(`CREATE INDEX "IDX_83bd32782d44d9db3d68c3f58c" ON "book_genres_genre" ("genreId") `);
        await queryRunner.query(`ALTER TABLE "user_details" ADD CONSTRAINT "FK_88e458d87409854029b830cabfa" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_51dabb934475afa077f62c116c0" FOREIGN KEY ("userDetailsId") REFERENCES "user_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "issue_history" ADD CONSTRAINT "FK_a6fb83fa393a6f6e9171c8c1848" FOREIGN KEY ("bookId") REFERENCES "book"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "issue_history" ADD CONSTRAINT "FK_37a1c05591ee5169dcefff49e25" FOREIGN KEY ("memberId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
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
        await queryRunner.query(`ALTER TABLE "issue_history" DROP CONSTRAINT "FK_37a1c05591ee5169dcefff49e25"`);
        await queryRunner.query(`ALTER TABLE "issue_history" DROP CONSTRAINT "FK_a6fb83fa393a6f6e9171c8c1848"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_51dabb934475afa077f62c116c0"`);
        await queryRunner.query(`ALTER TABLE "user_details" DROP CONSTRAINT "FK_88e458d87409854029b830cabfa"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_83bd32782d44d9db3d68c3f58c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_31d658e0af554165f4598158c5"`);
        await queryRunner.query(`DROP TABLE "book_genres_genre"`);
        await queryRunner.query(`DROP TABLE "books_amount_history"`);
        await queryRunner.query(`DROP TABLE "author"`);
        await queryRunner.query(`DROP TABLE "book"`);
        await queryRunner.query(`DROP TABLE "publisher"`);
        await queryRunner.query(`DROP TABLE "language"`);
        await queryRunner.query(`DROP TABLE "issue_history"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`DROP TABLE "user_details"`);
        await queryRunner.query(`DROP TABLE "group"`);
        await queryRunner.query(`DROP TABLE "genre"`);
    }

}
