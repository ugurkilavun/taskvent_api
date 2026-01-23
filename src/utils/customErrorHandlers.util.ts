import { Request, Response } from 'express';
// Types
import { authResponseType, projectResponseType } from "../types/responses.type";
import { levelType, loggerType, errorType } from "../types/logger.type";
// Middlewares
import { logger } from "../middlewares/logger.middleware";
// Utils
import { statusCodeErrors } from "./customErrors.util";
import { hashURLToken } from './urlTokens.util';

export class AuthExceptionHandler {
  async Handle<Args extends any[]>(
    loggerValue: {
      file: string,
      level: levelType,
      logType: string,
      service: string
    },
    req: Request,
    res: Response,
    func: (...args: Args) => Promise<authResponseType>,
    ...args: Args): Promise<void> {
    // For performance
    const initialPeriod = performance.now();

    // Logger
    const logg2r = new logger();

    // ? For Logger
    // Error Messages
    let errorType: errorType = undefined;
    let errorMessage: string = undefined;
    let errorStack: string = undefined;
    // Response Messages
    let responseMessage: string = undefined;

    try {
      const { message, accessToken, refreshToken, HTTPStatusCode }: authResponseType = await func(...args);
      res.status(HTTPStatusCode).json({ message, accessToken, refreshToken });
      responseMessage = message;

    } catch (error: any) {

      if (error instanceof statusCodeErrors) {
        res.status(error.statusCode).json({
          message: error.message,
        });

        // For Logger
        errorType = "STATCODEERROR";
        errorMessage = error?.message;
        errorStack = error?.stack;

      } else {
        res.status(500).json({
          message: "Server error!",
        });

        // For Logger
        errorType = "SERVERERROR";
        errorMessage = error?.message;
        errorStack = error?.stack;

        throw error;
      }
    }
    finally {

      // Logger - RESPONSE
      logg2r.create({
        timestamp: new Date(),
        level: loggerValue.level,
        logType: loggerValue.logType,
        message: errorMessage === undefined ? responseMessage : errorMessage,
        service: loggerValue.service,
        userID: req.method === "POST" ? req.body?.userID : req.params?.userID,
        token: req.query.token && hashURLToken((req.query.token).toString()).slice(0, 16),
        username: req.body?.username,
        ip: req.ip,
        endpoint: (req.url).includes("resetPassword") || (req.url).includes("verify")
          ? (req.url).split("?", 1).toString()
          : `/${(req.url).split("/")[1].toString()}`,
        method: req.method,
        userAgent: req.get('user-agent'),
        statusCode: res.statusCode,
        durationMs: performance.now() - initialPeriod,
        details: {
          error: errorType,
          stack: errorStack
        }
      }, { file: loggerValue.file, seeLogConsole: true });
    }
  };
}



// !=====================================

export class ProjectExceptionHandler {

  async Handle<Args extends any[]>(
    loggerValue: {
      file: string,
      level: levelType,
      logType: string,
      service: string
    },
    req: Request,
    res: Response,
    func: (...args: Args) => Promise<projectResponseType>,
    ...args: Args): Promise<void> {
    // For performance
    const initialPeriod = performance.now();

    // Logger
    const logg2r = new logger();

    // ? For Logger
    // Error Messages
    let errorType: errorType = undefined;
    let errorMessage: string = undefined;
    let errorStack: string = undefined;
    // Response Messages
    let responseMessage: string = undefined;

    try {
      const { message, projects, HTTPStatusCode }: projectResponseType = await func(...args);
      res.status(HTTPStatusCode).json({ message, projects });
      responseMessage = message;

    } catch (error: any) {

      if (error instanceof statusCodeErrors) {
        res.status(error.statusCode).json({
          message: error.message,
        });

        // For Logger
        errorType = "STATCODEERROR";
        errorMessage = error?.message;
        errorStack = error?.stack;

      } else {
        res.status(500).json({
          message: "Server error!",
        });

        // For Logger
        errorType = "SERVERERROR";
        errorMessage = error?.message;
        errorStack = error?.stack;

        throw error;
      }
    }
    finally {

      // Logger - RESPONSE
      logg2r.create({
        timestamp: new Date(),
        level: loggerValue.level,
        logType: loggerValue.logType,
        message: errorMessage === undefined ? responseMessage : errorMessage,
        service: loggerValue.service,
        userID: req.method === "POST" ? req.body?.userID : req.params?.userID,
        token: req.query.token && hashURLToken((req.query.token).toString()).slice(0, 16),
        username: req.body?.username,
        ip: req.ip,
        endpoint: (req.url).includes("resetPassword") || (req.url).includes("verify")
          ? (req.url).split("?", 1).toString()
          : `/${(req.url).split("/")[1].toString()}`,
        method: req.method,
        userAgent: req.get('user-agent'),
        statusCode: res.statusCode,
        durationMs: performance.now() - initialPeriod,
        details: {
          error: errorType,
          stack: errorStack
        }
      }, { file: loggerValue.file, seeLogConsole: true });
    }
  };

};

// export const resTryCatch = async <Args extends any[]>(
//   loggerValue: {
//     file: string,
//     level: levelType,
//     logType: string,
//     service: string
//   },
//   req: Request,
//   res: Response,
//   func: (...args: Args) => Promise<authResponseType>,
//   ...args: Args): Promise<void> => {

//   // For performance
//   const initialPeriod = performance.now();

//   // Logger
//   const logg2r = new logger();

//   // ? For Logger
//   // Error Messages
//   let errorType: errorType = undefined;
//   let errorMessage: string = undefined;
//   let errorStack: string = undefined;
//   // Response Messages
//   let responseMessage: string = undefined;

//   try {
//     const { response, userId, HTTPStatusCode }: authResponseType = await func(...args);
//     res.status(HTTPStatusCode).json(response);
//     responseMessage = response.message;

//   } catch (error: any) {

//     if (error instanceof statusCodeErrors) {
//       res.status(error.statusCode).json({
//         message: error.message,
//       });

//       // For Logger
//       errorType = "STATCODEERROR";
//       errorMessage = error?.message;
//       errorStack = error?.stack;

//     } else {
//       res.status(500).json({
//         message: "Server error!",
//       });

//       // For Logger
//       errorType = "SERVERERROR";
//       errorMessage = error?.message;
//       errorStack = error?.stack;

//       throw error;
//     }
//   }
//   finally {

//     // Logger - RESPONSE
//     logg2r.create({
//       timestamp: new Date(),
//       level: loggerValue.level,
//       logType: loggerValue.logType,
//       message: errorMessage === undefined ? responseMessage : errorMessage,
//       service: loggerValue.service,
//       userID: req.method === "POST" ? req.body?.userID : req.params?.userID,
//       token: req.query.token && hashURLToken((req.query.token).toString()).slice(0, 16),
//       username: req.body?.username,
//       ip: req.ip,
//       endpoint: (req.url).includes("resetPassword") || (req.url).includes("verify")
//         ? (req.url).split("?", 1).toString()
//         : `/${(req.url).split("/")[1].toString()}`,
//       method: req.method,
//       userAgent: req.get('user-agent'),
//       statusCode: 500,
//       durationMs: performance.now() - initialPeriod,
//       details: {
//         error: errorType,
//         stack: errorStack
//       }
//     }, { file: loggerValue.file, seeLogConsole: true });
//   }
// };