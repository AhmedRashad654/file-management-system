import { AppError } from "../../common/errors/AppError.js";

export const UserNotFoundError = new AppError("User not found", 404);

export const CannotModifyOwnRoleError = new AppError(
  "You cannot change your own role",
  403,
);

export const CannotDeleteOwnAccountError = new AppError(
  "You cannot delete your own account",
  403,
);


export const CannotRemoveLastAdminError = new AppError(
  "Cannot remove the last admin from the system",
  400,
);