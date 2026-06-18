import { STATUS_CODES } from "http";

export class APIError extends Error {
  constructor(message = 500, statusCode = STATUS_CODES[500]) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequest extends APIError {
  constructor(message = STATUS_CODES[400]) {
    super(message, 400);
  }
}

export class Unauthorized extends APIError {
  constructor(message = STATUS_CODES[401]) {
    super(message, 401);
  }
}

export class Forbidden extends APIError {
  constructor(message = STATUS_CODES[403]) {
    super(message, 403);
  }
}

export class NotFound extends APIError {
  constructor(message = STATUS_CODES[404]) {
    super(message, 404);
  }
}

export class BadGateway extends APIError {
  constructor(message = STATUS_CODES[502]) {
    super(message, 502);
  }
}
