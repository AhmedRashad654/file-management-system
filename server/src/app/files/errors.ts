import { AppError } from "../../common/errors/AppError.js";

export const FolderNotFoundError = new AppError("Folder not found", 404);

export const ParentFolderNotFoundError = new AppError(
  "Parent folder not found",
  404,
);

export const FolderNameConflictError = new AppError(
  "A folder with this name already exists in this location",
  400,
);

export const FileNotFoundError = new AppError("File not found", 404);

export const NoFilesUploadedError = new AppError("No files were uploaded", 400);

export const FileUploadFailedError = new AppError(
  "Failed to upload file",
  500,
);
