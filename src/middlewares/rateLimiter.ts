import rateLimit from 'express-rate-limit';

const FIFTEEN_MINUTES_IN_MILLISECONDS = 15 * 60 * 1000;

const rateLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES_IN_MILLISECONDS,
  max: 100,
});

export default rateLimiter;
