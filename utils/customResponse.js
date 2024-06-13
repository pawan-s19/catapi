export class Success {
  constructor(type, data, statusCode) {
    switch (type) {
      case "create":
        this.message = "Created successfully";
        break;
      case "update":
        this.message = "Updated successfully";
        break;
      case "delete":
        this.message = "Deleted successfully";
        break;

      default:
        this.message = "Ok";
    }
    this.data = data;
    this.statusCode = statusCode;
  }
}

export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
