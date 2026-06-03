const supabase = require('../config/supabaseClient');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    const error = new Error('Not authorised, no token');
    error.statusCode = 401;
    return next(error);
  }

  // Verify the JWT via Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.getUser(token);

  if (authError || !authData.user) {
    const error = new Error('Invalid or expired token');
    error.statusCode = 401;
    return next(error);
  }

  // Fetch the full student profile from Prisma
  const student = await prisma.student.findUnique({
    where: { id: authData.user.id },
  });

  if (!student) {
    const error = new Error('User no longer exists in database');
    error.statusCode = 401;
    return next(error);
  }

  req.user = student;
  next();
};

const authorise = (...roles) =>
  (req, res, next) => {
    // Currently, Prisma schema does not define a 'role' field for Students.
    // If you add one in the future, you can uncomment this check:
    /*
    if (!roles.includes(req.user.role)) {
      const error = new Error(
        `Role '${req.user.role}' is not authorised to access this route`
      );
      error.statusCode = 403;
      return next(error);
    }
    */
    next();
  };

module.exports = { protect, authorise };
