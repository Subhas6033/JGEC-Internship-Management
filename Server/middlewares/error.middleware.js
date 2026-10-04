export const errorMiddleware = (err, req, res, next) => {
  console.error("========== API ERROR ==========");
  console.error("Method:", req.method);
  console.error("URL:", req.originalUrl);
  console.error("Message:", err.message);
  console.error("Stack:", err.stack);
  console.error("================================");

  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    statusCode,
    message: err.message || "Something Went Wrong",
    success: err.success ?? false,
    data: err.data ?? null,
    error: err.error ?? [],
  });
};

export default errorMiddleware;
