import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  NotFoundException,
} from "@nestjs/common";
import { NextFunction, Response } from "express";
import Request from "../types/Request";
import ApiFilter from "./classes/ApiFilter";
import ApiError from "./classes/ApiError";
import ApiErrorCode from "./types/ApiErrorCode";

@Catch(NotFoundException)
class NotFoundExceptionFilter extends ApiFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();
    const next = ctx.getNext<NextFunction>();
    const error = new ApiError({ code: ApiErrorCode.BAD_REQUEST });

    if (req.url.startsWith("/api/v1")) {
      this.buildAndSendResponse(res, exception, error, HttpStatus.NOT_FOUND);
    } else {
      next();
    }
  }
}

export default NotFoundExceptionFilter;
