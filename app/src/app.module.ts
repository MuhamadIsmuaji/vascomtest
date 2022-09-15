import { Module } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";
import { SequelizeModule } from "@nestjs/sequelize";
import getDbConfig from "./config/db.config";
import ApiExceptionFilter from "./filters/api-exception.filter";
import DatabaseExceptionFilter from "./filters/database-exception.filter";
import GlobalExceptionFilter from "./filters/global-exception.filter";
import NotFoundExceptionFilter from "./filters/not-found-exception.filter";
import SyntaxExceptionFilter from "./filters/syntax-exception.filter";
import UnauthorizedExceptionFilter from "./filters/unauthorized-exception.filter";
import GlobalModule from "./global.module";
import AuthModule from "./modules/auth/auth.module";
import StaticModule from "./modules/static/static.module";

@Module({
  imports: [
    SequelizeModule.forRootAsync({ useFactory: () => getDbConfig() }),
    AuthModule,
    StaticModule,
    GlobalModule,
  ],
  providers: [
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
    { provide: APP_FILTER, useClass: ApiExceptionFilter },
    { provide: APP_FILTER, useClass: NotFoundExceptionFilter },
    { provide: APP_FILTER, useClass: SyntaxExceptionFilter },
    { provide: APP_FILTER, useClass: DatabaseExceptionFilter },
    { provide: APP_FILTER, useClass: UnauthorizedExceptionFilter },
  ],
})
class AppModule {}

export default AppModule;
