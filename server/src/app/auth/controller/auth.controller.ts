import type { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { sendSuccess } from "../../../common/http/response.js";
import { validate } from "../../../common/validation/validate.js";
import { TOKENS } from "../../../lib/di/tokens.js";
import {
  LoginDTO,
  RegisterDTO,
  ResendCodeDTO,
  VerifyEmailDTO,
} from "../dto/auth.dto.js";
import { AuthService } from "../service/auth.service.js";
import { AUTH_MESSAGES } from "../../../common/constants/messages.constants.js";

const REFRESH_TOKEN_COOKIE = "refresh_token";
const REFRESH_TOKEN_COOKIE_PATH = "/api/v1/auth/refresh";
const REFRESH_TOKEN_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

@injectable()
export class AuthController {
  constructor(
    @inject(TOKENS.AuthService) private readonly authService: AuthService,
  ) {}

  register = async (req: Request, res: Response) => {
    const data = validate(RegisterDTO, req.body);
    const { refreshToken, ...result } = await this.authService.register(data);
    this.setRefreshTokenCookie(res, refreshToken);
    sendSuccess(res, result, AUTH_MESSAGES.REGISTERED, 201);
  };

  login = async (req: Request, res: Response) => {
    const data = validate(LoginDTO, req.body);
    const { refreshToken, ...result } = await this.authService.login(data);
    this.setRefreshTokenCookie(res, refreshToken);
    sendSuccess(res, result, AUTH_MESSAGES.LOGGED_IN);
  };

  verifyEmail = async (req: Request, res: Response) => {
    const data = validate(VerifyEmailDTO, req.body);
    const result = await this.authService.verifyEmail(data);
    sendSuccess(res, result, AUTH_MESSAGES.VERIFIED);
  };

  resendCode = async (req: Request, res: Response) => {
    const data = validate(ResendCodeDTO, req.body);
    await this.authService.resendCode(data);
    sendSuccess(res, undefined, AUTH_MESSAGES.RESENT_CODE);
  };

  profile = async (req: Request, res: Response) => {
    const result = await this.authService.profile(req.userId!);
    sendSuccess(res, result, AUTH_MESSAGES.PROFILE_FETCHED);
  };

  refresh = async (req: Request, res: Response) => {
    const result = await this.authService.refresh(req.cookies.refresh_token);
    sendSuccess(res, result, AUTH_MESSAGES.TOKEN_REFRESHED);
  };

  logout = async (_req: Request, res: Response) => {
    res.clearCookie(REFRESH_TOKEN_COOKIE, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: REFRESH_TOKEN_COOKIE_PATH,
      sameSite: "lax",
    });
    sendSuccess(res, undefined, AUTH_MESSAGES.LOGGED_OUT);
  };

  private setRefreshTokenCookie(res: Response, token: string) {
    res.cookie(REFRESH_TOKEN_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: REFRESH_TOKEN_MAX_AGE_MS,
      path: REFRESH_TOKEN_COOKIE_PATH,
      sameSite: "lax",
    });
  }
}
