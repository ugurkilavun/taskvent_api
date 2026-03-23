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
import appConfig from "../configs/app.config";

// Class
// const exceptionHandlers = new ExceptionHandlers();
const authMiddleware = new AuthMiddleware();
const httpResponse = new HttpResponse();

// export const refreshController = (req: Request, res: Response): any => {
// // Datas
// const { token: refreshToken, client }:
//   { token: string | undefined, client: "web" | "mobile" } = await authMiddleware.resolveTokenSource(req.headers.authorization, req.cookies, "refreshToken");

// const { token: accessToken }:
//   { token: string | undefined } = await authMiddleware.resolveTokenSource(req.headers.authorization, req.cookies, "accessToken");

// // const refreshData = await authMiddleware.resolveTokenSource(req.headers.authorization, req.cookies, "refreshToken");
// console.log("accessToken:", accessToken);
// console.log("\n\rrefreshToken:", refreshToken);
// console.log("\n\rclient:", client);
// // throw new Error("test");

// await exceptionHandlers.authHandler(
//   client,
//   res,
//   () => refreshService(accessToken, refreshToken, client)
// );
// throw new statusCodeErrors("Token is invalid.1", 401);


// return refreshService(res);
// };

/**
 * Extracts the refresh token from the request based on the platform.
 * @param req - The Express Request object.
 * @param platform - Platform type ('web' or 'mobile').
 */
const extractRefreshToken = (req: Request, platform: platformType): string | undefined => {

  if (platform === "web") {
    const { token }: { token: string | undefined } = authMiddleware.resolveTokenSource(req.headers.authorization, req.cookies, TokenType.refreshToken);
    return token;
  };

  if (platform === "mobile") return req.body.refreshToken;

  return undefined;
};

export const refreshController = catchAsync(async (req: Request, res: Response): Promise<void> => {

  authMiddleware.validateAuthPresence(req.headers.authorization, req.cookies);

  // Datas
  const { token: accessTokenEx, platform }:
    { token: string | undefined, platform: platformType } = authMiddleware.resolveTokenSource(req.headers.authorization, req.cookies, TokenType.accessToken);

  const refreshToken: string | undefined = extractRefreshToken(req, platform);

  const { message, statusCode, accessToken }: authResponseType = await refreshService(accessTokenEx, refreshToken, platform);

  httpResponse.refresh(res, statusCode, platform, { message, accessToken });
});
