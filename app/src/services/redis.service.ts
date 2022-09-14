import { Injectable, Logger } from "@nestjs/common";
import IORedis, { RedisOptions } from "ioredis";

@Injectable()
class RedisService {
  private logger = new Logger(this.constructor.name);

  private readonly URL: string;

  constructor() {
    this.URL = process.env.REDIS_URL as string;
    this.attachUnexpectedErrorsHandler();
  }

  public createConnection(options?: RedisOptions): IORedis.Redis {
    const redisOptions: RedisOptions = { maxRetriesPerRequest: null };
    const isRedisSecure = this.URL.includes("rediss://");

    if (isRedisSecure) {
      redisOptions.tls = { rejectUnauthorized: false };
    }

    const connection = new IORedis(this.URL, {
      ...redisOptions,
      ...options,
    });

    connection.on("error", (error: any) => {
      this.logger.error(error);
    });

    connection.on("connect", () => {
      this.logger.log("Redis connection established");
    });

    return connection;
  }

  private attachUnexpectedErrorsHandler(): void {
    process.on("unhandledRejection", (reason: any = {}) => {
      const isRedisDeadError =
        reason.code === "ECONNREFUSED" &&
        this.URL.match(new RegExp(reason.address)) &&
        this.URL.match(new RegExp(reason.PORT));

      if (isRedisDeadError) {
        this.logger.error(reason);
      } else {
        throw reason;
      }
    });
  }
}

export default RedisService;
