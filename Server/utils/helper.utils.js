const asyncHandler = (requestHandler) => async (req, res, next) => {
  try {
    return await requestHandler(req, res, next);
  } catch (error) {
    console.error("Err!!! Coming from the asyncHandler...");
    console.error("Message:", error.message);
    console.error("Stack Trace:");
    console.error(error.stack);

    return res.status(error.statusCode || 500).json({
      statusCode: error.statusCode || 500,
      message: error.message || "Something Went Wrong",
      success: error.success ?? false,
      data: error.data ?? null,
      error: error.error ?? [],
    });
  }
};

class APIERR extends Error {
  constructor(
    statusCode,
    message = "Something Went Wrong",
    success = false,
    data = null,
    stack,
    error = [],
  ) {
    super(message);

    this.name = "APIERR";
    this.statusCode = statusCode;
    this.message = message;
    this.success = success;
    this.data = data;
    this.error = error;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

class APIRES {
  constructor(statusCode, data, message = "Success", success = true) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = success;
  }
}

export { asyncHandler, APIERR, APIRES };
