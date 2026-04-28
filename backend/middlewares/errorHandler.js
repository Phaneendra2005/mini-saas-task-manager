// Global error handler middleware
// Must have 4 parameters for Express to recognize it as an error handler
const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err);

  // Sequelize validation errors
  if (err.name === 'SequelizeValidationError') {
    const messages = err.errors.map((e) => e.message);
    return res.status(400).json({ error: messages.join(', ') });
  }

  // Sequelize unique constraint errors
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({ error: 'A record with that value already exists.' });
  }

  // Sequelize database errors
  if (err.name === 'SequelizeDatabaseError') {
    return res.status(500).json({ error: 'Database error. Please try again.' });
  }

  // JWT errors (fallback if not caught in middleware)
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token.' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Token expired.' });
  }

  // Default to 500 Internal Server Error
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal server error. Please try again.';

  res.status(statusCode).json({ error: message });
};

module.exports = errorHandler;
