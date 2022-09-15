import { QueryInterface, QueryTypes } from "sequelize";

const migration = {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(
        `
        CREATE SEQUENCE IF NOT EXISTS users_id_seq;
        CREATE TABLE "public"."users" (
          "id" int4 NOT NULL DEFAULT nextval('users_id_seq'::regclass),
          "email" VARCHAR(255) NOT NULL,
          "name" VARCHAR(255) NOT NULL,
          "role" int4 NOT NULL,
          "password" VARCHAR(255) NOT NULL,
          "isvalid" boolean DEFAULT 'false',
          "createdAt" timestamptz NOT NULL,
          "updatedAt" timestamptz NOT NULL,
          PRIMARY KEY ("id")
        );
        CREATE UNIQUE INDEX IF NOT EXISTS users_email on users ("email");
        `,
        {
          type: QueryTypes.RAW,
          transaction,
        },
      );
    });
  },
  down: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(`DROP TABLE IF EXISTS users;`, {
        type: QueryTypes.RAW,
        transaction,
      });
    });
  },
};

export default migration;
