import { Module } from "@nestjs/common";
import UsersModule from "../../api/users/users.module";
import AuthController from "./auth.controller";
import AuthService from "./auth.service";
import GuardController from "./guard.controller";

@Module({
  imports: [UsersModule],
  providers: [AuthService],
  controllers: [AuthController, GuardController],
})
class AuthModule {}

export default AuthModule;
