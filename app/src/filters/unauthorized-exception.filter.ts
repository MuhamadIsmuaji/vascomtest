import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  UnauthorizedException,
} from "@nestjs/common";
import { Response } from "express";
import Request from "../types/Request";
import ApiError from "./classes/ApiError";
import ApiFilter from "./classes/ApiFilter";
import ApiErrorCode from "./types/ApiErrorCode";

@Catch(UnauthorizedException)
class UnauthorizedExceptionFilter extends ApiFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();
    const error = new ApiError({ code: ApiErrorCode.UNAUTHORIZED });

    if (req.url.startsWith("/api/v1")) {
      this.buildAndSendResponse(res, exception, error, HttpStatus.UNAUTHORIZED);
    } else {
      req.session.destroy(() => null);
      res.redirect(301, "/");
    }
  }
}

export default UnauthorizedExceptionFilter;
