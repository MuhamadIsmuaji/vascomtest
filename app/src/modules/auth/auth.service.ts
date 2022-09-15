import { Injectable } from "@nestjs/common";
import Request from "../../types/Request";
import Helpers from "../../services/helpers";
import { hashValue } from "../../utils/functions";

@Injectable()
class AuthService {
  private rdPublisher;

  constructor(private helpers: Helpers) {
    this.rdPublisher = this.helpers.getRedisPublisher();
  }

  public async destroyUserSessions(userId: number): Promise<void> {
    const hashedUserId = hashValue(userId);
    const redisKeyPrefix = "sess:";
    const maxSessionsPerUser = 2;
    const limitSessions = maxSessionsPerUser - 1;

    const keys = await new Promise<string[]>((resolve, reject) => {
      this.rdPublisher.keys(`${redisKeyPrefix}${hashedUserId}_*`, (err, _keys) => {
        if (err != null) {
          reject(err);
          return;
        }

        resolve(_keys);
      });
    });

    if (maxSessionsPerUser > 0 && keys.length > limitSessions) {
      keys
        .sort((aKey: string, bKey: string): number => {
          const aTime = +aKey.split("_")[1];
          const bTime = +bKey.split("_")[1];
          if (aTime < bTime) return 1;
          if (aTime > bTime) return -1;

          return 0;
        })
        .splice(0, limitSessions);

      await this.rdPublisher.del(...keys);
    }
  }

  public async regenerateSession(req: Request): Promise<void> {
    const passportData = { ...(req.session as any).passport };
    return new Promise((resolve, reject) => {
      req.session.regenerate((err: any) => {
        if (err) {
          reject(err);
          return;
        }

        (req.session as any).passport = passportData;

        resolve();
      });
    });
  }
}

export default AuthService;
