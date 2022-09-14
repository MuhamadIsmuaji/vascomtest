const url = process.env.POSTGRES_URI;
const regex =
  /:\/\/(?<username>.*):(?<password>.*)@(?<host>[^:]+)(?<dirtyPort>:\d+)?\/(?<database>[^?]+)/;
const match = url.match(regex);

if (match == null) {
  throw new Error("POSTGRES_URI should be fully qualified string with username/password specified");
}

const { username, password, host, database, dirtyPort } = match.groups;
const port = dirtyPort ? Number(dirtyPort.slice(1)) : undefined;

module.exports = {
  production: {
    username,
    password,
    database,
    host,
    port,
    dialect: "postgres",
    migrationStorage: "sequelize",
    migrationStorageTableName: "_migrations",
  },
};
