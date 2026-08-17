import { inject, injectable } from "tsyringe";
import { TOKENS } from "../../../lib/di/tokens.js";
import { MailjetEmailProvider } from "../../../lib/email/mailjet.js";
import type { PrismaClient } from "../../../generated/prisma/client.js";
import {
  LoginDTO,
  RegisterDTO,
  ResendCodeDTO,
  VerifyEmailDTO,
} from "../dto/auth.dto.js";
import {
  EmailAlreadyVerifiedError,
  EmailNotVerifiedError,
  IncorrectCredentialsError,
  InvalidVerificationCodeError,
  NotAuthenticatedError,
  UserAlreadyExistsError,
  UserNotFoundError,
} from "../errors.js";
import { verificationCodeEmail } from "../templates/verify-email.js";
import type { JwtPayloadType, SafeUser, User } from "../types.js";
import {
  comparePassword,
  createAccessToken,
  createRefreshToken,
  generateVerificationCode,
  hashCode,
  hashPassword,
  VERIFICATION_CODE_TTL_MS,
  verifyRefreshToken,
} from "../utils.js";

@injectable()
export class AuthService {
  constructor(
    @inject(TOKENS.PrismaClient) private readonly prisma: PrismaClient,
    @inject(TOKENS.EmailProvider)
    private readonly emailProvider: MailjetEmailProvider,
  ) {}

  register = async (data: RegisterDTO) => {
    const existing = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existing) {
      throw UserAlreadyExistsError;
    }

    const password = await hashPassword(data.password);
    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password,
      },
    });

    await this.sendVerificationCode(user.id, user.email);
  };

  login = async (data: LoginDTO) => {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (!user) {
      throw IncorrectCredentialsError;
    }

    const match = await comparePassword(data.password, user.password);
    if (!match) {
      throw IncorrectCredentialsError;
    }

    if (!user.isVerified) {
      await this.sendVerificationCode(user.id, user.email);
      throw EmailNotVerifiedError;
    }

    return this.buildAuthResponse(user);
  };

  verifyEmail = async (data: VerifyEmailDTO) => {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (!user) {
      throw UserNotFoundError;
    }
    if (user.isVerified) {
      throw EmailAlreadyVerifiedError;
    }

    const record = await this.prisma.verificationCode.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
    if (!record) {
      throw InvalidVerificationCodeError;
    }

    const codeMatches = hashCode(data.code) === record.code;
    const isExpired = record.expiresAt < new Date();
    if (!codeMatches || isExpired) {
      throw InvalidVerificationCodeError;
    }

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: user.id },
        data: { isVerified: true },
      }),
      this.prisma.verificationCode.deleteMany({ where: { userId: user.id } }),
    ]);

    return this.buildAuthResponse({ ...user, isVerified: true });
  };

  resendCode = async (data: ResendCodeDTO) => {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (!user) {
      throw UserNotFoundError;
    }
    if (user.isVerified) {
      throw EmailAlreadyVerifiedError;
    }

    await this.sendVerificationCode(user.id, user.email);
  };

  profile = async (userId: string) => {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw UserNotFoundError;
    }
    return this.toSafeUser(user);
  };

  refresh = async (refreshToken?: string) => {
    if (!refreshToken) {
      throw NotAuthenticatedError;
    }

    const payload = verifyRefreshToken(refreshToken);
    const user = await this.prisma.user.findUnique({
      where: { id: payload.userId },
    });
    if (!user) {
      throw NotAuthenticatedError;
    }

    return createAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });
  };

  private async sendVerificationCode(userId: string, email: string) {
    const code = generateVerificationCode();
    await this.prisma.verificationCode.create({
      data: {
        userId,
        code: hashCode(code),
        expiresAt: new Date(Date.now() + VERIFICATION_CODE_TTL_MS),
      },
    });

    const { subject, html } = verificationCodeEmail(code);
    await this.emailProvider.send(email, subject, html);
  }

  private buildAuthResponse(user: User) {
    const payload: JwtPayloadType = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      accessToken: createAccessToken(payload),
      refreshToken: createRefreshToken(payload),
      user: this.toSafeUser(user),
    };
  }

  private toSafeUser(user: User): SafeUser {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    };
  }
}
