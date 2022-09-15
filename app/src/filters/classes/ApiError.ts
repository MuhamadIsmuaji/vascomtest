import ApiErrorCode from "../types/ApiErrorCode";
import PayloadError from "./PayloadError";

interface ApiErrorData {
  code: ApiErrorCode;
  message?: string;
  UImessage?: string;
  payloadErrors?: PayloadError[];
}

class ApiError {
  public code: ApiErrorCode;

  public message?: string;

  public UImessage?: string;

  public payloadErrors?: PayloadError[];

  constructor(data: ApiErrorData) {
    this.code = data.code;
    this.message = data.message;
    this.UImessage = data.UImessage;
    this.payloadErrors = data.payloadErrors;
  }
}

export default ApiError;
