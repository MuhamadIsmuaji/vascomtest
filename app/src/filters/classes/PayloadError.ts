import PayloadErrorCode from "../types/PayloadErrorCode";

interface PayloadErrorData {
  field: string;
  path: string;
  code: PayloadErrorCode;
  message?: string;
  value?: string;
}

class PayloadError {
  public field: string;

  public path: string;

  public code: PayloadErrorCode;

  public message?: string;

  public value?: string;

  constructor(data: PayloadErrorData) {
    this.field = data.field;
    this.path = data.path;
    this.code = data.code;
    this.message = data.message || "";
    this.value = data.value === undefined ? "" : data.value;
  }
}

export default PayloadError;
