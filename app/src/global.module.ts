import { Global, Module } from "@nestjs/common";
import { helpersProvider } from "./config/providers";
import UsersModule from "./api/users/users.module";
import RedisService from "./services/redis.service";

@Global()
@Module({
  imports: [UsersModule],
  exports: [helpersProvider],
  providers: [helpersProvider, RedisService],
})
class GlobalModule {}

export default GlobalModule;
