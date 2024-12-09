export const successResponse = (data: any, message = "Request successful") => ({
  success: true,
  message,
  data,
});

export const errorResponse = (message: string, statusCode = 500) => ({
  success: false,
  error: { message },
  statusCode,
});
