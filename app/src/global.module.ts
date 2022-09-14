import { Global, Module } from "@nestjs/common";
import { helpersProvider } from "./config/providers";
import RedisService from "./services/redis.service";

@Global()
@Module({
  imports: [],
  exports: [helpersProvider],
  providers: [helpersProvider, RedisService],
})
class GlobalModule {}

export default GlobalModule;
