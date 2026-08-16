export const AUTH_MESSAGES = {
  REGISTERED:
    "User registered successfully. Check your email to verify your account.",
  LOGGED_IN: "Login successful",
  VERIFIED: "Email verified successfully",
  RESENT_CODE: "Verification code sent to your email",
  PROFILE_FETCHED: "Profile fetched successfully",
  TOKEN_REFRESHED: "Token refreshed successfully",
  LOGGED_OUT: "Logged out successfully",
} as const;

export const USERS_MESSAGES = {
  LISTED: "Users fetched successfully",
  ROLE_UPDATED: "User role updated successfully",
  DELETED: "User deleted successfully",
} as const;

export const FOLDERS_MESSAGES = {
  CREATED: "Folder created successfully",
  DELETED: "Folder deleted successfully",
} as const;

export const FILES_MESSAGES = {
  UPLOADED: "Files uploaded successfully",
  LISTED: "Files fetched successfully",
  FETCHED: "File fetched successfully",
  DELETED: "File deleted successfully",
  ALL_LISTED: "All files fetched successfully",
  ADMIN_DELETED: "File deleted successfully",
} as const;

export const STATISTICS_MESSAGES = {
  USER_FETCHED: "Statistics fetched successfully",
  ADMIN_FETCHED: "Statistics fetched successfully",
} as const;
