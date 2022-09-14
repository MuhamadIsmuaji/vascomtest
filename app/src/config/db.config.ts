import { SequelizeModuleOptions } from "@nestjs/sequelize";
import { MODE } from "./utils";

const getDbConfig = (): SequelizeModuleOptions => {
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

  let options: SequelizeModuleOptions = {
    dialect: "postgres",
    ssl: process.env.POSTGRES_SSL_ON === "1",
    logging: false,
    host,
    port,
    database,
    username,
    password,
    autoLoadModels: true,
    synchronize: false,
  };

  // NOTE: this options might slightly decrease performance during development
  const syncOptions: Partial<SequelizeModuleOptions> = {
    synchronize: true,
    sync: {
      force: false,
      alter: true,
    },
  };

  if (process.env.MODE === MODE.DEV || process.env.MODE === MODE.TEST) {
    options = { ...options, ...syncOptions };
  }

  return options;
};

export default getDbConfig;
