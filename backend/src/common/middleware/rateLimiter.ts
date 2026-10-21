import rateLimit from 'express-rate-limit';

/**
 * Strict rate limiter for authentication endpoints (Login, Register, Password Reset)
 * Protects against credential brute-forcing, credential stuffing, and bot registration
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    code: 'TOO_MANY_REQUESTS',
    message: 'Too many authentication attempts from this IP. Please try again after 15 minutes.',
  },
});

/**
 * General API rate limiter for standard routes
 */
export const generalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 300, // Limit each IP to 300 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    code: 'TOO_MANY_REQUESTS',
    message: 'Too many requests. Please slow down.',
  },
});

/**
 * Sensitive operation limiter (Checkout / Inventory locks)
 */
export const checkoutLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 30, // 30 checkout attempts per 10 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    code: 'TOO_MANY_CHECKOUT_ATTEMPTS',
    message: 'Too many checkout attempts. Please try again in a few minutes.',
  },
});
