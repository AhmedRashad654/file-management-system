import rateLimit from 'express-rate-limit';

export const globalLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 500,
  message: { success: false, error: 'Too many requests, please try again shortly' },
  standardHeaders: true,
  legacyHeaders: false,
});


export const resendCodeLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
  message: { success: false, error: 'Too many resend requests, please try again shortly' },
});