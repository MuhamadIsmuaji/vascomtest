import { Response } from "express";
import { HttpStatus, Logger } from "@nestjs/common";
import PayloadErrorCode from "../types/PayloadErrorCode";
import ApiError from "./ApiError";
import PayloadError from "./PayloadError";
import ApiErrorCode from "../types/ApiErrorCode";
import FailedRequestResponse from "../types/FailedRequestResponse";

abstract class ApiFilter {
  protected logger = new Logger(this.constructor.name);

  private DEFAULT_RESPONSE_STATUS = HttpStatus.INTERNAL_SERVER_ERROR;

  protected buildAndSendResponse(
    res: Response,
    exception: any,
    error: ApiError,
    statusCode?: HttpStatus,
  ): void {
    const status = statusCode || exception.getStatus?.() || this.DEFAULT_RESPONSE_STATUS;
    const data = ApiFilter.buildResponseObject(error);

    this.logError(res, exception, error);
    res.status(status).json(data);
  }

  private static buildResponseObject(_error: ApiError): FailedRequestResponse {
    const error = { ..._error };

    if (error.payloadErrors !== undefined && error.payloadErrors.length > 0) {
      error.payloadErrors = ApiFilter.filterPayloadErrors(error.payloadErrors);
      error.message = error.payloadErrors
        .map((err) => `${err.field}.${err.code}`)
        .map((e) => {
          return e;
        })
        .reduce((a, b) => (a.includes(b) ? a : `${a},${b}`));
    }

    return { error };
  }

  private static filterPayloadErrors(errors: PayloadError[]): PayloadError[] {
    return errors.filter((error, i) => {
      const { code } = error;

      if (code === PayloadErrorCode.empty) {
        const firstEmptyErrorIndex = errors.findIndex(
          (err) => err.code === PayloadErrorCode.empty && err.path === error.path,
        );
        return i === firstEmptyErrorIndex;
      }

      if (code === PayloadErrorCode.bad_format) {
        const emptyRelated = errors.find(
          (err) => err.code === PayloadErrorCode.empty && err.path === error.path,
        );
        return emptyRelated == null;
      }

      const badFormatRelated = errors.find(
        (err) => err.code === PayloadErrorCode.bad_format && err.path === error.path,
      );

      return badFormatRelated == null;
    });
  }

  private logError(res: Response, exception: any, error: ApiError): void {
    const requestData = {
      referer: res.req.headers.referer,
      url: res.req.url,
    };

    this.logger.error(`Request failed: ${JSON.stringify(requestData, null, 2)}`);
    this.logger.error(exception.stack ?? error);
  }

  protected static getErrorCodeFromStatus(exception: any): ApiErrorCode {
    const status = exception.getStatus ? exception.getStatus() : 500;

    switch (status) {
      case 400:
        return ApiErrorCode.BAD_REQUEST;
      case 401:
      case 403:
        return ApiErrorCode.UNAUTHORIZED;
      case 404:
        return ApiErrorCode.NOT_FOUND;
      default:
        if (status < 500) {
          return ApiErrorCode.BAD_REQUEST;
        }

        return ApiErrorCode.INTERNAL_SERVER_ERROR;
    }
  }
}

export default ApiFilter;
