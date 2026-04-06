export class HttpError extends Error {
  statusCode: number;
  details?: any;

  constructor(message: string, statusCode: number, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = "HttpError";
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}
