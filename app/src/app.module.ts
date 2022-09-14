import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import getDbConfig from "./config/db.config";
import StaticModule from "./modules/static/static.module";

@Module({
  imports: [
    SequelizeModule.forRootAsync({ useFactory: () => getDbConfig() }),
    StaticModule
  ],
  providers: [],
})
class AppModule {}

export default AppModule;
