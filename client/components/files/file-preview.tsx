import Image from "next/image";
import { createElement } from "react";
import { FileAudio } from "lucide-react";
import { getFileColor, getFileIcon } from "@/utils";


export function FilePreview({
  mimeType,
  name,
  url,
}: {
  mimeType: string;
  name: string;
  url: string;
}) {
  if (mimeType.startsWith("image/")) {
    return (
      <div className="flex items-center justify-center rounded-lg bg-muted/50 p-2 min-h-50 max-h-100 overflow-hidden">
        <Image
          src={url}
          alt={name}
          width={200}
          height={200}
          className=" rounded-md"
        />
      </div>
    );
  }

  if (mimeType.startsWith("video/")) {
    return (
      <div className="flex items-center justify-center rounded-lg bg-muted/50 p-2 min-h-50">
        <video src={url} controls className="max-h-95 max-w-full rounded-md" />
      </div>
    );
  }

  if (mimeType.startsWith("audio/")) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg bg-muted/50 p-8 min-h-37.5 gap-4">
        <FileAudio className="h-16 w-16 text-green-500" />
        <audio src={url} controls className="w-full max-w-sm" />
      </div>
    );
  }

  if (mimeType === "application/pdf" ) {
    return (
      <div className="rounded-lg bg-muted/50 overflow-hidden h-125 w-full">
        <iframe src={url} title={name} className="w-full h-full border-0" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-lg bg-muted/50 p-6 min-h-20 gap-3">
      {createElement(getFileIcon(mimeType), {
        className: `h-12 w-16 ${getFileColor(mimeType)}`,
      })}
      <span className="text-sm text-muted-foreground">
        Preview not available for this file type
      </span>
    </div>
  );
}
