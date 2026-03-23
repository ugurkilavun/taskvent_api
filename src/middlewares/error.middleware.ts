import { Request, Response, NextFunction } from "express";
import { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";
// Configs
import appConfig from "../configs/app.config";
// Utils
import { statusCodeErrors } from '../utils/customErrors.util';
// Middlewares
import { Logger } from "./logger.middleware";

// Class
const logger = new Logger();

export const errorHandler = (error: Error | statusCodeErrors | TokenExpiredError | JsonWebTokenError, _req: Request, res: Response, _next: NextFunction): void => {

  const isDev = appConfig.nodeEnv === "development";

  if (error instanceof statusCodeErrors) {
    if (isDev) console.log("statusCodeErrors:", error);
    res.status(error.statusCode).json({
      message: error.message,
    });

  } else if (error instanceof TokenExpiredError) {
    if (isDev) console.log("TokenExpiredError:", error);
    res.status(401).json({
      message: "Token has expired.",
      error: "TOKEN_EXPIRED"
    });

  } else if (error instanceof JsonWebTokenError) {
    if (isDev) console.log("JsonWebTokenError:", error);
    res.status(401).json({
      message: "Token is invalid.",
      error: "INVALID_TOKEN"
    });
  }
  else {
    if (isDev) {
      console.log("---DEFAULT ERROR---");
      console.log(error.name);
      console.log(error.message);
      console.log(error.stack);
    };
    res.status(500).json({
      message: isDev ? error.message : "Server error!",
    });
    logger.create(_req, res, "error.json", error);
  }

};