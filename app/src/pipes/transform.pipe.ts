import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { plainToClass } from "class-transformer";

/**
 * Recursively transforms incoming request body into an instance of according DTO class.
 */
@Injectable()
class TransformPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): any {
    const { metatype, type } = metadata;

    if (["body", "param", "query"].includes(type) && metatype) {
      return plainToClass(metatype, value);
    }

    return value;
  }
}

export default TransformPipe;
