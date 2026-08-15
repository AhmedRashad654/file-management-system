import { AppError } from "../../common/errors/AppError.js";

export const UserAlreadyExistsError = new AppError(
  "User already exists with this email",
  400,
);

export const IncorrectCredentialsError = new AppError(
  "Incorrect email or password",
  401,
);

export const UserNotFoundError = new AppError("User not found", 404);

export const EmailNotVerifiedError = new AppError(
  "Your email is not verified. A verification code has been sent to your email.",
  403,
);

export const EmailAlreadyVerifiedError = new AppError(
  "Email is already verified",
  400,
);

export const InvalidVerificationCodeError = new AppError(
  "Invalid or expired verification code",
  400,
);

export const NotAuthenticatedError = new AppError("Not authenticated", 401);

export const InvalidTokenError = new AppError("Invalid or expired token", 401);
