import { Request, Response } from 'express';
import jwt, { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
// Types
import { authResponseType } from "../types/responses.type";
import { responseType, transactionType } from "../types/cusExceptionHandlers.type";
// Middlewares
// Utils
import { statusCodeErrors } from "./customErrors.util";
import { URLToken } from './urlTokens.util';

// Class
const urlToken = new URLToken;

export class ExceptionHandlers {

  // Auth Handler
  public async authHandler<Args extends any[]>(
    responseType: responseType,
    res: Response,
    func: (...args: Args) => Promise<authResponseType>,
    ...args: Args): Promise<void> {

    try {
      const { message, accessToken, refreshToken, statusCode }: authResponseType = await func(...args);

      if (responseType === "mobile") {
        res.locals.client = "mobile";
        res.status(statusCode).json({ message, accessToken, refreshToken });
      } else if (responseType === "web") {
        res.locals.client = "web";
        res
          .status(statusCode)
          .cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: true, // process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            // maxAge: 15 * 60 * 1000 // 15 min.
          })
          .cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true, // process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            // maxAge: 7 * 24 * 60 * 60 * 1000 // 7 day.
          })
          .json({
            message
          });

      } else {
        throw new Error("Auth error.");
      };

    } catch (error: any) {

      if (error instanceof statusCodeErrors) {
        res.status(error.statusCode).json({
          message: error.message,
        });
      } else if (error instanceof TokenExpiredError) {
        res.status(401).json({
          message: "Token expired.",
          error: "REFRESH_TOKEN_EXPIRED"
        });

      } else if (error instanceof TokenExpiredError) {
        console.log("401-refresh token has expired.")
        res.status(401).json({
          message: "Token has expired.",
          error: "REFRESH_TOKEN_EXPIRED"
        });

      } else if (error instanceof JsonWebTokenError) {
        res.status(401).json({
          message: "Token is invalid.",
          error: "INVALID_TOKEN"
        });
      }
      else {
        console.log(error.name);
        throw new Error(error);
      }

    }
  };

  // General response handler
  public async responseHandler<Args extends any[]>(
    transactionType: transactionType,
    res: Response,
    func: (...args: Args) => Promise<any>,
    ...args: Args): Promise<void> {

    try {

      switch (transactionType) {

        case "project": {
          const { message, projects, statusCode }: any = await func(...args);
          res.status(statusCode).json({ message, projects });
          break;
        }

        default:
          throw new Error("Response type not specified.");
      };


    } catch (error: any) {

      if (error instanceof statusCodeErrors) {
        res.status(error.statusCode).json({
          message: error.message,
        });

      } else throw new Error(error);
    }

  };

};
