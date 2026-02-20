import jwt, { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
// Middlewares
import { Logger } from './logger.middleware';
// Utils
import { statusCodeErrors } from '../utils/customErrors.util';
// Types
import { errorType } from "../types/logger.type";

export class AuthMiddleware {

  public async getToken(mobileToken: string | undefined, webToken: any | undefined, tokentype: "accessToken" | "refreshToken"): Promise<string | undefined> {

    if (mobileToken?.startsWith("Bearer ") && webToken[tokentype]) throw new statusCodeErrors("Multiple authentication methods provided.", 400);

    /// Mobile / API clients: req.headers.authorization
    if (mobileToken?.startsWith("Bearer ")) return mobileToken.split(" ")[1]

    // Web: req.cookies
    if (webToken[tokentype]) return webToken[tokentype];

    return undefined;
  };

  // Solution: https://runebook.dev/en/docs/typescript/docs/handbook/2/classes/this-based-type-guards
  public checkToken = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    // For performance
    const initialPeriod = performance.now();

    // Datas
    // let token: string | undefined;

    // Logger
    const logger = new Logger();

    // ? For Logger
    // Error Messages
    let errorType: errorType = undefined;
    let errorMessage: string = undefined;
    let errorStack: string = undefined;
    // Response Messages
    let responseMessage: string = undefined;

    try {

      // Initial Check
      if (!req.headers.authorization && !req.cookies) throw new statusCodeErrors("Token is missing or invalid.", 401);;

      const token: any = await this.getToken(req.headers.authorization, req.cookies, "accessToken");
      if (!token) throw new statusCodeErrors("Token is invalid.", 401);

      const decoded: any = jwt.verify(token, process.env.ACCESS_SECRET);

      res.locals.user = { id: decoded.id, username: decoded.username };

      responseMessage = "Valid token.";

      next();
    } catch (error: any) {

      if (error instanceof statusCodeErrors) {

        // For Logger
        errorType = "STATCODEERROR";
        errorMessage = error?.message;
        errorStack = error?.stack;

        res.status(error.statusCode).json({
          message: error.message,
        });

      } else if (error instanceof TokenExpiredError) {

        // For Logger
        errorType = "TOKENERROR";
        errorMessage = error?.message;
        errorStack = error?.stack;

        res.status(401).json({
          message: "Access token has expired.",
          error: "TOKEN_EXPIRED"
        });

      } else if (error instanceof JsonWebTokenError) {

        // For Logger
        errorType = "TOKENERROR";
        errorMessage = error?.message;
        errorStack = error?.stack;


        res.status(401).json({
          message: "Access token invalid.",
          // error: "INVALID_TOKEN"
        });

      } else {

        // For Logger
        errorType = "SERVERERROR";
        errorMessage = error instanceof Error ? error.message : "Unknown error";
        errorStack = error instanceof Error ? error.stack : undefined;

        res.status(500).json({
          message: "Server error."
        });

      }
    } finally {
      // Logger - RESPONSE
      logger.create({
        timestamp: new Date(),
        level: "AUDIT",
        logType: "auth",
        message: errorMessage ?? responseMessage,
        service: "auth.middleware",
        username: req.body?.username,
        ip: req.ip,
        endpoint: req.url,
        method: req.method,
        userAgent: req.get('user-agent'),
        statusCode: res.statusCode,
        durationMs: performance.now() - initialPeriod,
        details: {
          error: errorType,
          stack: errorStack
        }
      }, { file: "auths", seeLogConsole: true });
    }
  }

};