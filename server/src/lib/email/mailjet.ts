import Mailjet from "node-mailjet";
import { inject, injectable } from "tsyringe";
import { TOKENS } from "../di/tokens";
import { Logger } from "../../common/logger/logger";
import { AppError } from "../../common/errors/AppError";
import { requireEnv } from "../../utils/requireEnv";

@injectable()
export class MailjetEmailProvider {
  private readonly client;
  private readonly fromEmail: string;
  private readonly fromName: string;

  constructor(@inject(TOKENS.Logger) private readonly logger: Logger) {
    this.client = new Mailjet({
      apiKey: requireEnv("MAILJET_API_KEY"),
      apiSecret: requireEnv("MAILJET_SECRET_KEY"),
    });
    this.fromEmail = requireEnv("MAILJET_FROM_EMAIL");
    this.fromName = requireEnv("MAILJET_FROM_NAME");
  }

  async send(to: string, subject: string, html: string): Promise<void> {
    try {
      await this.client.post("send", { version: "v3.1" }).request({
        Messages: [
          {
            From: { Email: this.fromEmail, Name: this.fromName },
            To: [{ Email: to }],
            Subject: subject,
            HTMLPart: html,
          },
        ],
      });
    } catch {
      throw new AppError("Failed to send email via Mailjet", 400);
    }
  }
}
