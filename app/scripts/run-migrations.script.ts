import * as childProcess from "child_process";
import * as dotenv from "dotenv";
import { promisify } from "util";
import { Logger } from "@nestjs/common";
import { MODE } from "../src/config/utils";

dotenv.config();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const exec = promisify(childProcess.exec);
const logger = new Logger("Migrations");

const runMigrations = async () => {
  if (process.env.MODE === MODE.PROD) {
    await exec("yarn migrations:up");
  }
};

runMigrations()
  .then(() => process.exit(0))
  .catch((err) => {
    logger.error("Database migration failed");
    logger.error(err.toString?.() || err);
    process.exit(1);
  });
