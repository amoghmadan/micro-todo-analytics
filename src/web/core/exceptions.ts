import { STATUS_CODES } from "node:http";

export class APIError extends Error {
  readonly statusCode: number | string;
  readonly isOperational = true;

  constructor(
    message: string | number = STATUS_CODES[500] ?? 500,
    statusCode: number | string = STATUS_CODES[500] ?? 500
  ) {
    super(String(message));
    this.statusCode = statusCode;
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class BadRequest extends APIError {
  constructor(message: string | number = STATUS_CODES[400] ?? 400) {
    super(message, 400);
  }
}

export class Unauthorized extends APIError {
  constructor(message: string | number = STATUS_CODES[401] ?? 401) {
    super(message, 401);
  }
}

export class Forbidden extends APIError {
  constructor(message: string | number = STATUS_CODES[403] ?? 403) {
    super(message, 403);
  }
}

export class NotFound extends APIError {
  constructor(message: string | number = STATUS_CODES[404] ?? 404) {
    super(message, 404);
  }
}

export class BadGateway extends APIError {
  constructor(message: string | number = STATUS_CODES[502] ?? 502) {
    super(message, 502);
  }
}

export class Conflict extends APIError {
  constructor(message: string | number = STATUS_CODES[409] ?? 409) {
    super(message, 409);
  }
}

export class GatewayTimeout extends APIError {
  constructor(message: string | number = STATUS_CODES[504] ?? 504) {
    super(message, 504);
  }
}
