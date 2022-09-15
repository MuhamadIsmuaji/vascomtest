import * as fs from "fs";
import * as util from "util";
import * as path from "path";
import { Logger } from "@nestjs/common";

const readdir = util.promisify(fs.readdir);
const unlink = util.promisify(fs.unlink);
const logger = new Logger("POST-BUILD");

const cleanUpMigrationsFolder = async () => {
  const migrationsPath = path.join(process.cwd(), "dist/db/migrations");
  const files = await readdir(migrationsPath);
  const filesToRemove = files
    .filter((fileName) => fileName.endsWith(".js") === false)
    .map((fileName) => `${migrationsPath}/${fileName}`);

  await Promise.all(filesToRemove.map((file) => unlink(file)));
};

Promise.resolve()
  .then(cleanUpMigrationsFolder)
  .then(() => process.exit(0))
  .catch((err) => {
    logger.error(err);
    process.exit(1);
  });
