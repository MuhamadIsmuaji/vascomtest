import { promisify } from "util";
import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";
import { Logger } from "@nestjs/common";

dotenv.config();

const copyFile = promisify(fs.copyFile);
const logger = new Logger("GEN-MIGRATIONS");

const generateMigration = async () => {
  const migrationsPath = path.join(process.cwd(), "app/db/migrations");
  const skeletonFilePath = path.join(migrationsPath, "..", "migration-skeleton.ts");
  const migrationName = process.argv[2];

  if (migrationName == null) {
    throw new Error("migration name param should be passed to script");
  }

  const migrationFileName = `${new Date().getTime()}_${migrationName}.ts`;
  const migrationFilePath = path.join(migrationsPath, migrationFileName);

  await copyFile(skeletonFilePath, migrationFilePath);
};

generateMigration()
  .then(() => process.exit(0))
  .catch((err) => {
    logger.error(err.toString?.() || err);
    process.exit(1);
  });
