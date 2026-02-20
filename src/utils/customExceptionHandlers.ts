import { Request, Response } from 'express';
import jwt, { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
// Types
import { authResponseType, projectResponseType } from "../types/responses.type";
import { levelType, loggerType, errorType } from "../types/logger.type";
import { responseType, transactionType } from "../types/cusExceptionHandlers.type";
// Middlewares
import { Logger } from "../middlewares/logger.middleware";
// Utils
import { statusCodeErrors } from "./customErrors.util";
import { URLToken } from './urlTokens.util';

// ! 1. Bu sınıfları birleştirbeililr misin? Bi düşün. (Inheritance) Miras almayı kullanmayı da düşün.
// ! 2. Refresh.controller ile aut.middleware neredeyse aynı. Onlara özel bir errorhandler yazabililirisin. Ama dikkat et tamamen aynı mı diye!
// ! 3. Logger'ı daha kolay kullanıma sun.
// Class
const urlToken = new URLToken;

export class ExceptionHandlers {


  // extractEndpoint: Extract endpoint from URL
  private extractEndpoint(url: string): string {
    // Handle special endpoints
    if (url.includes("resetPassword") || url.includes("verify")) {
      const parts = url.split("?");
      return parts[0];
    }

    // Extract first segment after domain
    const segments = url.split('/').filter((segment: string) => segment);
    return segments.length > 0 ? `/${segments[0]}` : '/';
  };

  // Auth Handler
  public async authHandler<Args extends any[]>(
    loggerConfig: {
      file: string,
      level: levelType,
      logType: string,
      service: string
    },
    responseType: responseType,
    req: Request,
    res: Response,
    func: (...args: Args) => Promise<authResponseType>,
    ...args: Args): Promise<void> {

    // For performance
    const initialPeriod = performance.now();

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
      const { message, accessToken, refreshToken, HTTPStatusCode }: authResponseType = await func(...args);

      if (responseType === "mobile") {
        responseMessage = message;

        res.status(HTTPStatusCode).json({ message, accessToken, refreshToken });
      } else if (responseType === "web") {
        responseMessage = message;

        res
          .status(HTTPStatusCode)
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
        // For Logger
        errorType = "STATCODEERROR";
        errorMessage = error?.message;
        errorStack = error?.stack;

        res.status(error.statusCode).json({
          message: error.message,
        });
      } else if (error instanceof TokenExpiredError) {
        errorType = "TOKENERROR";
        errorMessage = error?.message;
        errorStack = error?.stack;

        res.status(401).json({
          message: "Token expired.",
          error: "REFRESH_TOKEN_EXPIRED"
        });

      } else {
        // For Logger
        errorType = "SERVERERROR";
        errorMessage = error instanceof Error ? error.message : "Unknown error";
        errorStack = error instanceof Error ? error.stack : undefined;

        res.status(500).json({
          message: "Server error!",
        });
      }


    }
    finally {
      // Logger - RESPONSE
      logger.create({
        timestamp: new Date(),
        level: loggerConfig.level,
        logType: loggerConfig.logType,
        // message: errorMessage === undefined ? responseMessage : errorMessage,
        message: errorMessage ?? responseMessage,
        service: loggerConfig.service,
        username: req.body?.username,
        ip: req.ip,
        // endpoint: this.extractEndpoint(req.url),
        endpoint: req.url,
        method: req.method,
        userAgent: req.get('user-agent'),
        statusCode: res.statusCode,
        durationMs: performance.now() - initialPeriod,
        details: {
          error: errorType,
          stack: errorStack
        }
      }, { file: loggerConfig.file, seeLogConsole: true });
    }
  };

  // General response handler
  public async responseHandler<Args extends any[]>(
    loggerConfig: {
      file: string,
      level: levelType,
      logType: string,
      service: string
    },
    transactionType: transactionType,
    req: Request,
    res: Response,
    func: (...args: Args) => Promise<projectResponseType>,
    ...args: Args): Promise<void> {
    // For performance
    const initialPeriod = performance.now();

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

      switch (transactionType) {

        case "project": {
          const { message, projects, HTTPStatusCode }: projectResponseType = await func(...args);
          res.status(HTTPStatusCode).json({ message, projects });
          responseMessage = message;
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

      }
    }
    finally {

      // Logger - RESPONSE
      logger.create({
        timestamp: new Date(),
        level: loggerConfig.level,
        logType: loggerConfig.logType,
        // message: errorMessage === undefined ? responseMessage : errorMessage,
        message: errorMessage ?? responseMessage,
        service: loggerConfig.service,
        userID: req.method === "POST" ? req.body?.userID : req.params?.userID,
        token: req.query.token && urlToken.hash((req.query.token).toString()).slice(0, 16),
        username: req.body?.username,
        ip: req.ip,
        endpoint: (req.url).includes("resetPassword") || (req.url).includes("verify")
          ? (req.url).split("?", 1).toString()
          : `/${(req.url).split("/")[1].toString()}`,
        // endpoint: this.extractEndpoint(req.url),
        method: req.method,
        userAgent: req.get('user-agent'),
        statusCode: res.statusCode,
        durationMs: performance.now() - initialPeriod,
        details: {
          error: errorType,
          stack: errorStack
        }
      }, { file: loggerConfig.file, seeLogConsole: true });
    }
  };

};

// export class AuthExceptionHandler {

//   async Handle<Args extends any[]>(
//     loggerConfig: {
//       file: string,
//       level: levelType,
//       logType: string,
//       service: string
//     },
//     req: Request,
//     res: Response,
//     func: (...args: Args) => Promise<authResponseType>,
//     ...args: Args): Promise<void> {
//     // For performance
//     const initialPeriod = performance.now();

//     // Logger
//     const logger = new Logger();

//     // ? For Logger
//     // Error Messages
//     let errorType: errorType = undefined;
//     let errorMessage: string = undefined;
//     let errorStack: string = undefined;
//     // Response Messages
//     let responseMessage: string = undefined;

//     try {
//       const { message, accessToken, refreshToken, HTTPStatusCode }: authResponseType = await func(...args);
//       res.status(HTTPStatusCode).json({ message, accessToken, refreshToken });
//       responseMessage = message;

//     } catch (error: any) {

//       if (error instanceof statusCodeErrors) {
//         res.status(error.statusCode).json({
//           message: error.message,
//         });

//         // For Logger
//         errorType = "STATCODEERROR";
//         errorMessage = error?.message;
//         errorStack = error?.stack;

//       } else {
//         res.status(500).json({
//           message: "Server error!",
//         });

//         // For Logger
//         errorType = "SERVERERROR";
//         errorMessage = error?.message;
//         errorStack = error?.stack;

//         throw error;
//       }
//     }
//     finally {

//       // Logger - RESPONSE
//       logger.create({
//         timestamp: new Date(),
//         level: loggerConfig.level,
//         logType: loggerConfig.logType,
//         message: errorMessage === undefined ? responseMessage : errorMessage,
//         service: loggerConfig.service,
//         userID: req.method === "POST" ? req.body?.userID : req.params?.userID,
//         token: req.query.token && hashURLToken((req.query.token).toString()).slice(0, 16),
//         username: req.body?.username,
//         ip: req.ip,
//         endpoint: (req.url).includes("resetPassword") || (req.url).includes("verify")
//           ? (req.url).split("?", 1).toString()
//           : `/${(req.url).split("/")[1].toString()}`,
//         method: req.method,
//         userAgent: req.get('user-agent'),
//         statusCode: res.statusCode,
//         durationMs: performance.now() - initialPeriod,
//         details: {
//           error: errorType,
//           stack: errorStack
//         }
//       }, { file: loggerConfig.file, seeLogConsole: true });
//     }
//   };
// }



// // !=====================================

// export class ProjectExceptionHandler {

//   async Handle<Args extends any[]>(
//     loggerConfig: {
//       file: string,
//       level: levelType,
//       logType: string,
//       service: string
//     },
//     req: Request,
//     res: Response,
//     func: (...args: Args) => Promise<projectResponseType>,
//     ...args: Args): Promise<void> {
//     // For performance
//     const initialPeriod = performance.now();

//     // Logger
//     const logger = new Logger();

//     // ? For Logger
//     // Error Messages
//     let errorType: errorType = undefined;
//     let errorMessage: string = undefined;
//     let errorStack: string = undefined;
//     // Response Messages
//     let responseMessage: string = undefined;

//     try {
//       const { message, projects, HTTPStatusCode }: projectResponseType = await func(...args);
//       res.cookie('sessionID', '1234', { secure: true, httpOnly: true });
//       res.status(HTTPStatusCode).json({ message, projects });
//       responseMessage = message;

//     } catch (error: any) {

//       if (error instanceof statusCodeErrors) {
//         res.status(error.statusCode).json({
//           message: error.message,
//         });

//         // For Logger
//         errorType = "STATCODEERROR";
//         errorMessage = error?.message;
//         errorStack = error?.stack;

//       } else {
//         res.status(500).json({
//           message: "Server error!",
//         });

//         // For Logger
//         errorType = "SERVERERROR";
//         errorMessage = error?.message;
//         errorStack = error?.stack;

//         throw error;
//       }
//     }
//     finally {

//       // Logger - RESPONSE
//       logger.create({
//         timestamp: new Date(),
//         level: loggerConfig.level,
//         logType: loggerConfig.logType,
//         message: errorMessage === undefined ? responseMessage : errorMessage,
//         service: loggerConfig.service,
//         userID: req.method === "POST" ? req.body?.userID : req.params?.userID,
//         token: req.query.token && hashURLToken((req.query.token).toString()).slice(0, 16),
//         username: req.body?.username,
//         ip: req.ip,
//         endpoint: (req.url).includes("resetPassword") || (req.url).includes("verify")
//           ? (req.url).split("?", 1).toString()
//           : `/${(req.url).split("/")[1].toString()}`,
//         method: req.method,
//         userAgent: req.get('user-agent'),
//         statusCode: res.statusCode,
//         durationMs: performance.now() - initialPeriod,
//         details: {
//           error: errorType,
//           stack: errorStack
//         }
//       }, { file: loggerConfig.file, seeLogConsole: true });
//     }
//   };

// };

// export const resTryCatch = async <Args extends any[]>(
//   loggerConfig: {
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
//   const logger = new logger();

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
//     logger.create({
//       timestamp: new Date(),
//       level: loggerConfig.level,
//       logType: loggerConfig.logType,
//       message: errorMessage === undefined ? responseMessage : errorMessage,
//       service: loggerConfig.service,
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
//     }, { file: loggerConfig.file, seeLogConsole: true });
//   }
// };