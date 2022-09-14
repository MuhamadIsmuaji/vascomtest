import * as passport from "passport";
import * as express from "express";
import * as compression from "compression";
import * as RedisSessionLib from "connect-redis";
import * as expressSession from "express-session";
import * as path from "path";
import * as errorHandler from "errorhandler";
import * as bodyParser from "body-parser";
import * as methodOverride from "method-override";
import * as serverFavicon from "serve-favicon";
import { Application, NextFunction, Response } from "express";
import { MODE } from "./utils";
import Request from "../types/Request";
import { hashValue, makeHash } from "../utils/functions";
import RedisService from "../services/redis.service";

const useMiddleware = (app: Application, redisService: RedisService): void => {
  const RedisStore = RedisSessionLib(expressSession);
  const redisClient = redisService.createConnection();

  app.use(compression());

  app.set("views", path.join(global.projectRoot, "app/views"));
  app.set("view engine", "pug");

  app.use(
    express.static(path.resolve(global.projectRoot, "public"), {
      maxAge: process.env.MODE !== MODE.DEV ? 31536000 : 0,
    }),
  );

  if (process.env.MODE !== MODE.DEV) {
    app.enable("view cache");
  }

  app.use(errorHandler());

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
  app.use(methodOverride());

  app.use(
    expressSession({
      store: new RedisStore({ client: redisClient }),
      secret: "Secret session salt is secured",
      cookie: { maxAge: 1000 * 60 * 60 * 24 * 30 * 12 * 20 },
      resave: true,
      saveUninitialized: false,
      genid(req: Request): string {
        // const userId = req.user?.id;
        const userId = undefined;
        let genid = `_${makeHash(32)}`;
        if (userId !== undefined) {
          const hashedUserId = hashValue(userId);
          const now = new Date().getTime();
          genid = `${hashedUserId}_${now}${genid}`;
        }

        return genid;
      },
    }),
  );

  app.use((req: any, res: Response, next: NextFunction) => {
    res.header(
      "Cache-Control",
      "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0",
    );

    const locals = {
      url: req.url,
      datenow: new Date(),
      config: process.env,
      NOCACHE: Math.random(),
    };

    // eslint-disable-next-line no-param-reassign
    app.locals = { ...app.locals, ...locals };

    next();
  });

  app.use(serverFavicon("public/favicon.png"));

  app.use(passport.initialize());
  app.use(passport.session());

  // eslint-disable-next-line no-param-reassign
  app.locals = { config: process.env };
};

export default useMiddleware;
