/* eslint-disable no-restricted-syntax,no-await-in-loop,max-classes-per-file */
import { Logger } from "@nestjs/common";
import { Sequelize } from "sequelize-typescript";
import * as fs from "fs";
import * as path from "path";
import { Transaction } from "sequelize";
import { MODE } from "../src/config/utils";

class MockQueryInterface {
  public sequelize: any = {};

  constructor(private connection: Sequelize, private transaction: Transaction) {
    this.sequelize = connection;
    this.sequelize.transaction = this.mockTransaction.bind(this);
  }

  private async mockTransaction(func: any) {
    await func(this.transaction);
  }
}

class MigrationsValidator {
  private static logger = new Logger("MigrationsValidator");

  private static connection: Sequelize;

  private static isValidationFailed = false;

  private static migrationsPath = path.join(__dirname, "../db/migrations");

  public static async run(): Promise<void> {
    try {
      this.validateEnv();

      await this.setupConnection();
      await this.validateMigrations();

      await this.exit();
    } catch (err: any) {
      this.logger.error(err.toString());
      await this.exit(1);
    }
  }

  private static validateEnv(): void {
    const requiredVars = ["POSTGRES_URI", "MIGRATIONS_STATEMENT_TIMEOUT"];
    const missingVars = requiredVars.filter((varName) => process.env[varName] === undefined);

    if (missingVars.length > 0) {
      throw new Error(`missing environment variables - ${missingVars.join(", ")}`);
    }

    if (Number.isNaN(Number(process.env.MIGRATIONS_STATEMENT_TIMEOUT)) === true) {
      throw new Error("MIGRATIONS_STATEMENT_TIMEOUT should be a valid number");
    }
  }

  private static async setupConnection(): Promise<void> {
    const url = process.env.POSTGRES_URI!;
    const regex =
      /:\/\/(?<username>.*):(?<password>.*)@(?<host>[^:]+)(?<dirtyPort>:\d+)?\/(?<database>[^?]+)/;
    const match = url.match(regex);

    if (match == null) {
      throw new Error(
        "POSTGRES_URI should be fully qualified string with username/password specified",
      );
    }

    const { username, password, host, database, dirtyPort } = match.groups as any;
    const port = dirtyPort ? Number(dirtyPort.slice(1)) : undefined;

    this.connection = new Sequelize({
      dialect: "postgres",
      ssl: true,
      logging: false,
      host,
      port,
      database,
      username,
      password,
    });

    await this.connection.authenticate();
  }

  private static async validateMigrations(): Promise<void> {
    const pendingMigrations = await this.getPendingMigrations();

    if (pendingMigrations.length === 0) {
      return;
    }

    this.logger.log(`New migrations detected: ${pendingMigrations.join(", ")}`);

    const transaction = await this.connection.transaction();

    await this.connection.query(
      `SET LOCAL statement_timeout = ${process.env.MIGRATIONS_STATEMENT_TIMEOUT || 30_000}`,
      { transaction },
    );

    await this.validateUp(pendingMigrations, transaction);
    await this.validateDown(pendingMigrations, transaction);

    await transaction.rollback();
  }

  private static async getPendingMigrations(): Promise<string[]> {
    const allMigrations = fs.readdirSync(path.join(this.migrationsPath));
    const appliedMigrations = await this.connection
      .query(`SELECT name FROM _migrations`)
      .then((res) => res[0].map((migration: any) => migration.name));

    return allMigrations.filter((migr) => appliedMigrations.includes(migr) === false);
  }

  private static async validateUp(migrations: string[], transaction: Transaction): Promise<void> {
    for (const migrationName of migrations) {
      try {
        const migration = await import(path.join(this.migrationsPath, migrationName));
        const queryInterface = new MockQueryInterface(this.connection, transaction);

        await migration.default.up(queryInterface);

        this.logger.log(`${migrationName}[UP] successfully validated`);
      } catch (err: any) {
        this.logger.error(`${migrationName}[UP] failed: ${err.toString()}`);
        this.isValidationFailed = true;
      }
    }
  }

  private static async validateDown(
    _migrations: string[],
    transaction: Transaction,
  ): Promise<void> {
    const migrations = [..._migrations].reverse();

    for (const migrationName of migrations) {
      try {
        const migration = await import(path.join(this.migrationsPath, migrationName));
        const queryInterface = new MockQueryInterface(this.connection, transaction);

        await migration.default.down(queryInterface);

        this.logger.log(`${migrationName}[DOWN] successfully validated`);
      } catch (err: any) {
        this.logger.error(`${migrationName}[DOWN] failed: ${err.toString()}`);
        this.isValidationFailed = true;
      }
    }
  }

  public static async exit(code?: number): Promise<void> {
    await this.connection.close();

    if (code !== undefined) {
      process.exitCode = code;
    } else if (this.isValidationFailed === true) {
      process.exitCode = 1;
    } else {
      process.exitCode = 0;
    }
  }
}

if (process.env.MODE === MODE.PROD) {
  MigrationsValidator.run();
}
