import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { Response } from "express";
import { EmptyResultError, ValidationError } from "sequelize";
import ApiFilter from "./classes/ApiFilter";
import ApiError from "./classes/ApiError";
import ApiErrorCode from "./types/ApiErrorCode";

type DatabaseException = EmptyResultError | ValidationError;

@Catch(EmptyResultError, ValidationError)
class DatabaseExceptionFilter extends ApiFilter implements ExceptionFilter {
  catch(exception: DatabaseException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    let error;
    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    switch (exception.constructor.name) {
      case "EmptyResultError": {
        error = new ApiError({
          code: ApiErrorCode.NOT_FOUND,
          message: `${exception.message}.not_found`,
        });
        status = HttpStatus.NOT_FOUND;
        break;
      }
      case "ValidationError": {
        error = new ApiError({
          code: ApiErrorCode.BAD_REQUEST,
          message: exception.message.replace("Validation error: ", ""),
        });
        status = HttpStatus.BAD_REQUEST;
        break;
      }
      default: {
        error = new ApiError({ code: ApiErrorCode.INTERNAL_SERVER_ERROR });
      }
    }

    this.buildAndSendResponse(res, exception, error, status);
  }
}

export default DatabaseExceptionFilter;
