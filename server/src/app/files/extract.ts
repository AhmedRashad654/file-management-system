import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";
import type { Logger } from "../../common/logger/logger.js";

const DOCX_MIME_TYPES = new Set([
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
]);

export async function extractContent(
  mimetype: string,
  buffer: Buffer,
  logger: Logger,
): Promise<string | null> {
  try {
    if (mimetype === "application/pdf") {
      const parser = new PDFParse({ data: new Uint8Array(buffer) });
      const result = await parser.getText();
      return result.text;
    }

    if (DOCX_MIME_TYPES.has(mimetype)) {
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    }

    if (mimetype.startsWith("text/")) {
      return buffer.toString("utf-8");
    }

    return null;
  } catch (error) {
    logger.warn("Failed to extract content from file", {
      mimetype,
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}
