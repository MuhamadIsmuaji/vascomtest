import { Response } from "express";
import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import ApiError from "./classes/ApiError";
import ApiFilter from "./classes/ApiFilter";

@Catch()
class GlobalExceptionFilter extends ApiFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const status = exception.getStatus ? exception.getStatus() : null;
    const message = status != null && status < 500 ? exception.message : "something went wrong";

    const code = ApiFilter.getErrorCodeFromStatus(exception);
    const error = new ApiError({ code, message });

    this.buildAndSendResponse(res, exception, error);
  }
}

export default GlobalExceptionFilter;
