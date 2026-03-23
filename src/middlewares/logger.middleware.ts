import { NextFunction, Request, Response } from 'express';
import fs from "fs";
import crypto from "crypto";
import path from "path";
// Types
import { LoggerType, LogLevel, ErrorInfo } from "../types/logger.type";
// Middleware
import { AuthMiddleware } from "./auth.middleware";
// Configs
import appConfig from "../configs/app.config";

// Class
const authMiddleware = new AuthMiddleware();

export class Logger {

  /**
   * Records comprehensive log data to a JSON file upon request completion.
   * This method captures request/response metadata, performance metrics,
   * authenticated user information, and optional error details. In development
   * mode, it also outputs a formatted summary to the console.
   * @param req - The Express request object.
   * @param res - The Express response object containing locals like 'initialPeriod' and 'user'.
   * @param file - The target log file name ("info.json", "warn.json", or "error.json").
   * @param errorInfo - Optional object containing error details (name?, message, stack?).
   */
  public async create(req: Request, res: Response, file: "info.json" | "warn.json" | "error.json", errorInfo?: ErrorInfo): Promise<void> {

    const filePath: string = path.join(__dirname, '..', 'logs', file);
    const TEMP_DATA: any = fs.readFileSync(filePath);
    const data = JSON.parse(TEMP_DATA);
    const duration = performance.now() - res.locals.initialPeriod;

    // Logger Varibles
    const LOGID = crypto.randomUUID();
    const DATENOW = new Date().toISOString().replace('T', ' ').slice(0, 19);

    // Make directories
    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    // Log varible
    const message: string = res.locals.responseMessage ? res.locals.responseMessage : res.statusMessage;
    const { token }: { token: string } = await authMiddleware.resolveTokenSource(req.headers.authorization, req.cookies, "accessToken");
    const splitedToken: string = !token ? undefined : token.split(".")[0];
    const level: LogLevel = this.parseLogLevel(res.statusCode);

    const newData: LoggerType =
    {
      logID: LOGID,
      timestamp: DATENOW,
      level: level,
      environment: appConfig.nodeEnv,
      client: res.locals.client,
      message: message,

      // Request and response details
      // request
      request: {
        method: req.method,
        url: req.url,
        ip: req.ip,
        httpVersion: req.httpVersion,
        headers: {
          contentType: req.headers['content-type'],
          userAgent: req.headers['user-agent'],
          accept: req.headers.accept,
          acceptEncoding: req.headers['accept-encoding'],
          connection: req.headers.connection,
          contentLength: req.headers['content-length'],
          host: req.headers.host,
        }
      },
      // Response
      response: {
        statusCode: res.statusCode,
        durationMs: duration,
        headers: {
          contentType: res.get('Content-Type'),
          contentLength: res.get('Content-Length'),
        },
      },

      // User informations
      user: {
        id: res.locals.user?.id,
        token: splitedToken && `${splitedToken}.****.****`,
        email: req.body?.username,
      },

      // Error condition
      error: {
        name: errorInfo?.name,
        message: errorInfo?.message,
        stack: errorInfo?.stack,
      }
    };

    // Data
    data.push(newData);
    const jsonData = JSON.stringify(data, null, 2);

    // Write file
    fs.writeFileSync(filePath, jsonData, 'utf8');

    // [2024-01-15 10:23:45] INFO: POST /auth/web/login 200 — 43ms
    if (appConfig.nodeEnv === "development" && level === "INFO") console.log(`\x1b[36m[${DATENOW}] ${level}: ${req.method} ${req.url} ${res.statusCode} — ${duration.toFixed(2)}\x1b[0m`);
    if (appConfig.nodeEnv === "development" && level === "WARN") console.log(`\x1b[93m[${DATENOW}] ${level}: ${req.method} ${req.url} ${res.statusCode} — ${duration.toFixed(2)}\x1b[0m`);
    if (appConfig.nodeEnv === "development" && level === "ERROR") console.log(`\x1b[31m[${DATENOW}] ${level}: ${req.method} ${req.url} ${res.statusCode} — ${duration.toFixed(2)}\x1b[0m`);

  };

  /**
   * It performs logging when the request is completed.
   * @param req - Express request object
   * @param res - Express response object
   * @param next - Express next method (NextFunction)
   */
  // Solution: https://runebook.dev/en/docs/typescript/docs/handbook/2/classes/this-based-type-guards
  public middleware = (req: Request, res: Response, next: NextFunction): void => {

    // ? Varibles
    res.locals.initialPeriod = performance.now();

    // Get response message
    this.getResponseMessage(res);

    res.on('finish', () => {
      try {

        const statusCode: number = Number(res.statusCode.toString()[0]);

        // Warn
        if (statusCode === 4) {
          this.create(req, res, "warn.json");
        };

        // Info
        if (statusCode === 2) {
          this.create(req, res, "info.json");
        };

      } catch (error: any) {
        // throw new Error(error);
        if (appConfig.nodeEnv === "development") console.log("/===*===\ Logger Error /===*===\ \n\r", error);
      }

    });

    next();

  };

  private getResponseMessage(res: Response) {
    const originalJson: Function = res.json;

    res.json = function (body: any) {
      // res.locals
      res.locals.responseMessage = body.message;

      // Call original method
      return originalJson.call(this, body);
    };
  };

  /**
   * Determines the appropriate log level based on the HTTP status code category.
   * - 2xx (Success)     -> INFO
   * - 4xx (Client Error) -> WARN
   * - 5xx (Server Error) -> ERROR
   * @param statusCode - The HTTP status code to evaluate (e.g., 200, 404, 500)
   */
  private parseLogLevel(statusCode: number): LogLevel {
    const category: number = Number(statusCode.toString()[0]);

    switch (category) {
      case 2: return "INFO";
      case 4: return "WARN";
      case 5: return "ERROR";
      default: return "DEBUG";
    };
  };

};