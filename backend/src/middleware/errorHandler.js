// Global error handler middleware
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.error(err.name || 'Error', err.message || err);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Prisma Record Not Found
  if (err.code === 'P2025') {
    statusCode = 404;
    message = 'Resource not found';
  }

  // Prisma Unique Constraint Violation
  if (err.code === 'P2002') {
    statusCode = 400;
    const target = err.meta?.target || 'field';
    message = `Duplicate value for unique field: ${target}`;
  }

  // Prisma Validation Error
  if (err.name === 'PrismaClientValidationError') {
    statusCode = 400;
    message = 'Invalid data provided';
  }

  // Supabase Auth / JWT errors
  if (err.name === 'AuthApiError' || err.__isAuthError) {
    statusCode = err.status || 401;
    message = err.message || 'Authentication error';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
