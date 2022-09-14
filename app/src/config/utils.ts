import { LogLevel, Logger } from "@nestjs/common";

export const appLogger = new Logger("APP");

export const MODE = {
  PROD: "production",
  DEV: "development",
  TEST: "test",
};

export const getEnvLogLevel = (): LogLevel[] | false => {
  switch (process.env.MODE) {
    case MODE.PROD:
      return ["log", "error", "warn"];
    case MODE.DEV:
      return ["log", "error", "warn", "debug", "verbose"];
    case MODE.TEST:
      return [];
    default:
      return [];
  }
};

const terminationAllowance = Number(process.env.GRACEFUL_TERMINATION_ALLOWANCE);

export const gracefulTerminationEnabled =
  Number.isInteger(terminationAllowance) && terminationAllowance > 0;

export const enableGracefulTermination = () => {
  if (gracefulTerminationEnabled === false) {
    appLogger.warn(
      "Graceful termination is not enabled, please set GRACEFUL_TERMINATION_ALLOWANCE as a natural number",
    );

    return;
  }

  const startGracefulTermination = () => {
    appLogger.log(
      `Started graceful termination, process will terminate in ${terminationAllowance}ms`,
    );
    setTimeout(() => process.exit(0), terminationAllowance).unref();
  };

  process.once("SIGTERM", startGracefulTermination);
  process.once("SIGINT", startGracefulTermination);
};
