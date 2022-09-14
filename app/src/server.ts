import "colors";
import { ExpressAdapter, NestExpressApplication } from "@nestjs/platform-express";
import { NestFactory } from "@nestjs/core";
import * as express from "express";
import runManualGarbageCollector from "./config/gc";
import AppModule from "./app.module";
import { appLogger, getEnvLogLevel } from "./config/utils";
import useMiddleware from "./config/use-middleware";
import TransformPipe from "./pipes/transform.pipe";
import RedisService from "./services/redis.service";

async function bootstrap(): Promise<void> {
  const app = express();
  useMiddleware(app, new RedisService());

  const server = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(app),
    { logger: getEnvLogLevel() },
  );

  server.useGlobalPipes(new TransformPipe());

  process.on("uncaughtException", (reason: any = {}) => {
    appLogger.error(`Uncaught exception: ${reason.toString().red}`);
  });

  await server.listen(process.env.PORT!, process.env.HOSTIP!);

  if (Number(process.env.MANUALLY_COLLECT_GARBAGE) && global.gc) {
    runManualGarbageCollector();
  }
}

export default bootstrap;
