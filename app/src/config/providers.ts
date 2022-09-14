import { ClassProvider } from "@nestjs/common";
import Helpers from "../services/helpers";

// eslint-disable-next-line import/prefer-default-export
export const helpersProvider: ClassProvider = {
  provide: Helpers,
  useClass: Helpers,
};
