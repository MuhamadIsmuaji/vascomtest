import { Injectable } from "@nestjs/common";
import IORedis from "ioredis";
import RedisService from "./redis.service";

@Injectable()
class Helpers {
  private rdPublisher;

  constructor(protected redisService: RedisService) {
    this.rdPublisher = this.redisService.createConnection();
  }

  public getRedisPublisher(): IORedis.Redis {
    return this.rdPublisher;
  }

  public validateEmail(email: string): boolean {
    return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      email,
    );
  }
}

export default Helpers;
