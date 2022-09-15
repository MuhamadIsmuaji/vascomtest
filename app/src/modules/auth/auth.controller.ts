import { Controller, HttpCode, HttpStatus, Next, Post, Req, Res } from "@nestjs/common";
import * as passport from "passport";
import * as LocalStrategy from "passport-local";
import * as crypto from "crypto";
import AuthService from "./auth.service";
import UsersService from "../../api/users/users.service";
import Helpers from "../../services/helpers";
import UserModel from "src/api/users/user.model";
import { UniqueConstraintError } from "sequelize";
import Request from "../../types/Request";
import { NextFunction, Response } from "express";
import ApiException from "../../filters/classes/ApiException";
import PayloadError from "../../filters/classes/PayloadError";
import PayloadErrorCode from "../../filters/types/PayloadErrorCode";

@Controller()
class AuthController {

  constructor(
    private helpers: Helpers,
    private usersService: UsersService,
    private authService: AuthService)
  {
    passport.use(
      "usernamepassword",
      new LocalStrategy.Strategy(
        {
          passReqToCallback: true,
          usernameField: "email",
          passwordField: "password",
        },
        (req, _email, password, done) => {
          if (_email && password) {
            const email = _email.toLowerCase();
            const hash = crypto.createHmac("sha256", "SaLtY").update(password).digest("hex");

            this.usersService.model
              .findOne({
                where: {
                  email,
                  password: hash,
                },
              })
              .then(function (user) {
                if (user) {
                  done(null, user.get());
                } else {
                  done(null, false, { message: "user.not_found" });
                }
              });
          } else {
            done(null, false, { message: "Invalid credentials" });
          }
        }
      )
    );

    passport.use(
      "signup",
      new LocalStrategy.Strategy(
        {
          passReqToCallback: true,
          usernameField: "email",
          passwordField: "password",
        },
        async (req, emailPass, __, done) => {
          if (!emailPass) {
            return done(null, false, { message: "Not enough credentials" });
          }

          const email = emailPass.toLowerCase();
          const emailValid = this.helpers.validateEmail(email);

          if (!emailValid) {
            return done(null, false, { message: "Not a valid email" });
          }

          const isEmailInUse = await this.usersService.isEmailInUse(email);

          if (isEmailInUse) {
            return done(null, false, { message: "User already exists" });
          }

          let newUser: UserModel | undefined;

          try {
            newUser = await this.usersService.model.create({
              email,
            });
          } catch (err) {
            if (err instanceof UniqueConstraintError) {
              return done(null, false, { message: "Failed to signup" });
            }

            throw err;
          }

          done(null, newUser?.get());
        }
      )
    );
  }

  @Post("/api/signup")
  @HttpCode(200)
  public async signup(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ): Promise<void> {
    if (req.user != null) {
      throw new ApiException("loggedin", HttpStatus.BAD_REQUEST);
    }

    if (!req.body.username || !this.helpers.validateEmail(req.body.username)) {
      throw new ApiException(
        new PayloadError({
          code: PayloadErrorCode.invalid,
          field: "username",
          path: "username",
          message: "invalid",
          value: req.body.username,
        }),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

}

export default AuthController;
