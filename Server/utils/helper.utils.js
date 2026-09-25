const asyncHandler = (requestHandler) => async (req, res, next) => {
  try {
    return await requestHandler(req, res, next);
  } catch (error) {
    console.log(`Err!!! Coming from the asyncHandler... ${error}`);
    res.status(Error.statusCode || 500).json({
      statusCode: Error.statusCode || 500,
      message: "Something Went Wrong",
      success: false,
    });
  }
};

class APIERR extends Error {
  constructor(
    statusCode,
    messge = "Something Went Wrong",
    success = false,
    data = null,
    stack,
    error = [],
  ) {
    super(messge);
    ((this.statusCode = statusCode),
      (this.message = messge),
      (this.success = success),
      (this.data = data));
    this.stack = stack;
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
    ((this.statusCode = statusCode),
      (this.data = data)((this.message = message)),
      (this.success = success));
  }
}

export { asyncHandler, APIERR, APIRES };
