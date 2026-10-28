import { Request, Response } from 'express';
import jwt, { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
// Services
import refreshService from "../services/refresh.service";
// Middlewares
import { AuthMiddleware } from "../middlewares/auth.middleware";
// Utils
import { statusCodeErrors } from '../utils/customErrors.util';
import catchAsync from "../utils/catchAsync.util";
import { HttpResponse } from "../utils/response.util";
// Types
import { authResponseType } from '../types/responses.type';
import { platformType } from '../types/platform.type';
import { TokenType } from "../types/token.type";

// Class
// const exceptionHandlers = new ExceptionHandlers();
const authMiddleware = new AuthMiddleware();
const httpResponse = new HttpResponse();

export const refreshController = catchAsync(async (req: Request, res: Response): Promise<void> => {

  authMiddleware.validateAuthPresence(req.headers.authorization, req.cookies);

  // Datas
  const { token: accessTokenEx, platform }:
    { token: string | undefined, platform: platformType | undefined } = authMiddleware.resolveTokenSource(req.headers.authorization, req.cookies, TokenType.accessToken);

  let refreshToken: string | undefined = undefined;

  if (platform === "web") {
    const { token }: { token: string | undefined } = authMiddleware.resolveTokenSource(req.headers.authorization, req.cookies, TokenType.refreshToken);
    refreshToken = token;
  };

  if (platform === "mobile") refreshToken = req.body.refreshToken;

  if (!refreshToken) throw new statusCodeErrors("Platform not detected.", 400);

  const { message, statusCode, accessToken }: authResponseType = await refreshService(accessTokenEx, refreshToken, platform);

  httpResponse.refresh(res, statusCode, platform, { message, accessToken });
});
