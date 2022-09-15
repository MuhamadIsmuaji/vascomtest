import { Response } from "express";
import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import ApiError from "./classes/ApiError";
import ApiFilter from "./classes/ApiFilter";
import ApiErrorCode from "./types/ApiErrorCode";

@Catch(SyntaxError)
class SyntaxExceptionFilter extends ApiFilter implements ExceptionFilter {
  catch(exception: SyntaxError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const error = new ApiError({
      code: ApiErrorCode.BAD_REQUEST,
      message: "The data sent with the request is not valid JSON",
    });

    this.buildAndSendResponse(res, exception, error, HttpStatus.BAD_REQUEST);
  }
}

export default SyntaxExceptionFilter;
