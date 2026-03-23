import jwt, { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
// Utils
import { statusCodeErrors } from '../utils/customErrors.util';
// Types
import { TokenType } from "../types/token.type";
import { platformType } from "../types/platform.type";

export class AuthMiddleware {

  /**
    * Middleware to refresh user sessions by validating and cross-referencing JWT tokens.
    * Extracts Access and Refresh tokens from multiple sources (Headers or Cookies),
    * verifies the integrity of the Refresh Token, and ensures the user identity
    * matches between both tokens to prevent session hijacking.
    * @param req - Express request object containing headers and cookies.
    * @param res - Express response object to store local user data.
    * @param next - Express callback to pass control to the next middleware.
    */
  public refreshMiddleware = (req: Request, res: Response, next: NextFunction): void => {

    this.validateAuthPresence(req.headers.authorization, req.cookies);

    // Datas
    const { token: accessToken, platform }:
      { token: string | undefined, platform: platformType } = this.resolveTokenSource(req.headers.authorization, req.cookies, TokenType.accessToken);

    const refreshToken: string | undefined = this.extractRefreshToken(req, platform);

    if (!refreshToken) throw new statusCodeErrors("Token is missing.", 401);

    if (!accessToken || !refreshToken || !platform) throw new statusCodeErrors("Token is missing or invalid.", 401);

    const decodedAccessToken: any = jwt.decode(accessToken);
    const decodedRefreshToken: any = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    if (decodedAccessToken.id !== decodedRefreshToken.id && decodedAccessToken.username !== decodedRefreshToken.username) throw new statusCodeErrors("Session validation failed.", 401);

    res.locals.user = { id: decodedAccessToken.id, username: decodedAccessToken.username };
    res.locals.platform = platform;

    next();

  };

  /**
   * Extracts the refresh token from the request based on the platform.
   * @param req - The Express Request object.
   * @param platform - Platform type ('web' or 'mobile').
   */
  private extractRefreshToken(req: Request, platform: string): string | undefined {

    if (platform === "web") {
      const { token }: { token: string | undefined } = this.resolveTokenSource(req.headers.authorization, req.cookies, TokenType.refreshToken);
      return token;
    };

    if (platform === "mobile") return req.body.refreshToken;

    return undefined;
  };

  /**
    * Middleware to secure application routes by validating JWT tokens in the request.
    * Verifies the token's presence, integrity, and expiration before proceeding.
    * @param req - Express request object containing headers and cookies
    * @param res - Express response object for sending error statuses
    * @param next - Express callback to pass control to the next middleware
    */
  // Solution: https://runebook.dev/en/docs/typescript/docs/handbook/2/classes/this-based-type-guards
  public middleware = (req: Request, res: Response, next: NextFunction): void => {

    this.validateAuthPresence(req.headers.authorization, req.cookies);

    const { token, platform }: { token: string | undefined, platform: platformType } = this.resolveTokenSource(req.headers.authorization, req.cookies, "accessToken");
    if (!token || !platform) throw new statusCodeErrors("Token is missing or invalid.", 401);

    const decoded: any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    res.locals.user = { id: decoded.id, username: decoded.username };
    res.locals.platform = platform;

    next();

  };

  /**
   * Identifies the authentication source and extracts the raw JWT token.
   * Determines if the request originates from a Mobile (Authorization Header) or Web (Cookies) platform.
   * @param mobileToken - Authorization header (e.g., "Bearer <token>")
   * @param webToken - The cookies object containing session tokens.
   * @param tokentype - The specific token key to look for in cookies
   */
  public resolveTokenSource(mobileToken: string | undefined, webToken: any | undefined, tokentype: "accessToken" | "refreshToken" = "accessToken"): { token: string | undefined, platform: platformType } {

    /// Mobile / API clients: req.headers.authorization
    if (mobileToken?.startsWith("Bearer ")) return { token: mobileToken.split(" ")[1], platform: "mobile" };

    // Web: req.cookies
    if (webToken?.[tokentype]) return { token: webToken?.[tokentype], platform: "web" };

    return { token: undefined, platform: undefined };
  };

  /**
   * Validates the consistency of authentication sources.
   * @param authHeader - The 'Authorization' header from req.headers.
   * @param cookies - The 'req.cookies' object containing client-side cookies.
   * @throws {statusCodeErrors} 400 - If multiple authentication methods are provided.
   * @throws {statusCodeErrors} 401 - If no authentication token or cookie is found.
   */
  private validateAuthPresence(authHeader: string, cookies: object): void {

    // Datas
    const hasHeader: boolean = !!authHeader;
    const hasCookie: boolean = Object.keys(cookies).includes(TokenType.accessToken);

    // Situation 1: Both methods are provided (Conflict)
    if (hasHeader && hasCookie) throw new statusCodeErrors("Multiple auth methods provided.", 400);

    // Situation 2: No method provided (Incompleteness)
    if (!hasHeader && !hasCookie) throw new statusCodeErrors("Token is missing or invalid.", 401);
  };

};