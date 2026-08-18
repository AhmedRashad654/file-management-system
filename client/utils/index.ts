import { File, FileText, FileImage, FileVideo, FileAudio } from "lucide-react";

export function getFileIcon(mimeType: string) {
  if (mimeType.startsWith("image/")) return FileImage;
  if (mimeType.startsWith("video/")) return FileVideo;
  if (mimeType.startsWith("audio/")) return FileAudio;
  if (mimeType === "application/pdf") return FileText;
  if (mimeType.includes("document") || mimeType.includes("word"))
    return FileText;
  if (mimeType.startsWith("text/")) return FileText;
  return File;
}

export function getFileColor(mimeType: string): string {
  if (mimeType.startsWith("image/")) return "text-blue-500";
  if (mimeType.startsWith("video/")) return "text-purple-500";
  if (mimeType.startsWith("audio/")) return "text-green-500";
  if (mimeType === "application/pdf") return "text-red-500";
  if (mimeType.includes("document") || mimeType.includes("word"))
    return "text-blue-600";
  if (mimeType.startsWith("text/")) return "text-gray-500";
  return "text-gray-400";
}

export function formatSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
