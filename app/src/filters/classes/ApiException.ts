import { HttpException, HttpStatus } from "@nestjs/common";
import ApiError from "./ApiError";
import PayloadError from "./PayloadError";

class ApiException extends HttpException {
  constructor(
    response: string | Error | ApiError | PayloadError | PayloadError[],
    status: HttpStatus,
  ) {
    super(response, status);
    this.message = this.getMessage();
  }

  private getMessage(): string {
    const response = this.getResponse();

    if (typeof response === "string") {
      return response;
    }

    if (response instanceof ApiError) {
      return response.message || response.UImessage || this.message;
    }

    if (response instanceof PayloadError && response.message !== undefined) {
      return response.message;
    }

    if (response instanceof Array) {
      return response.map((err: PayloadError) => err.message).join(", ");
    }

    return this.message;
  }
}

export default ApiException;
