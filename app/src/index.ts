import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config();
global.projectRoot = path.join(__dirname, "../..");

// eslint-disable-next-line import/first
import bootstrap from "./server";

bootstrap();
