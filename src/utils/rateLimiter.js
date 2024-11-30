import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  message: { message: "Too many login attempts. Please try again later." },
  legacyHeaders: true,
});



export const signUpLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  message: { message: "Too many signup attempts. Please try again later." },
  legacyHeaders: true,
});