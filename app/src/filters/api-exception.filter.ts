import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { Response } from "express";
import ApiError from "./classes/ApiError";
import PayloadError from "./classes/PayloadError";
import ApiFilter from "./classes/ApiFilter";
import ApiException from "./classes/ApiException";

@Catch(ApiException)
class ApiExceptionFilter extends ApiFilter implements ExceptionFilter {
  catch(exception: ApiException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const response = exception.getResponse();
    const code = ApiFilter.getErrorCodeFromStatus(exception);
    let error: ApiError;

    if (response instanceof ApiError) {
      error = response;
    } else if (response instanceof PayloadError) {
      error = new ApiError({ code, payloadErrors: [response] });
    } else if (Array.isArray(response)) {
      error = new ApiError({ code, payloadErrors: response });
    } else {
      const message = exception.getStatus() < 500 ? response.toString() : "";
      error = new ApiError({ code, message });
    }

    this.buildAndSendResponse(res, exception, error);
  }
}

export default ApiExceptionFilter;
