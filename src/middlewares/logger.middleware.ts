import { NextFunction, Request, Response } from 'express';
import fs from "fs";
import crypto from "crypto";
import path from "path";
import chalk from "chalk";
import dotenv from 'dotenv';
// Types
import { LoggerType, LogLevel, ErrorInfo } from "../types/logger.type";
// Middleware
import { AuthMiddleware } from "./auth.middleware";

// .env config
dotenv.config({ quiet: true });

// Class
const authMiddleware = new AuthMiddleware();

export class Logger {

  /**
    * Extract endpoint from URL
    * @param {string} url - Url
    */
  private resolveLogCategory(url: string): { file: string, service: string } {

    const AuthEndpoints: string[] = ["login", "logout", "register", "refresh", "reset", "verify"];

    // ? Resolve the service name from the URL
    const resolveServiceFromUrl = (selectedEndpoint: string): string => {
      const splitedUrl: Array<string> = url.split("/").filter((filter: string) => filter);
      // const authSet = new Set(authEndpoints);
      splitedUrl.splice(splitedUrl.indexOf(selectedEndpoint), 1);

      for (let i = splitedUrl.length - 1; i >= 0; i--) {
        if (new Set(AuthEndpoints).has(splitedUrl[i])) return splitedUrl[i];
      };

      return undefined;
    };

    if (url.includes("auth")) return { file: "auths", service: resolveServiceFromUrl("auth") };
    if (url.includes("task")) return { file: "tasks", service: "task" };
    if (url.includes("team")) return { file: "teams", service: "team" };
    if (url.includes("project")) return { file: "projects", service: "project" };

    // fileName, service
    return { file: undefined, service: undefined };
  };

  /**
    * It performs logging when the request is completed.
    * @param {Object} req - Express request object
    * @param {Object} res - Express response object
    * @param {number} duration - Request completion time (ms)
    */
  public async create(req: Request, res: Response, duration: number, errorInfo?: ErrorInfo): Promise<void> {

    // * Return undefined for 5xx responses
    if (Number(res.statusCode.toString().at(0)) === 5) return;

    //  File & Service
    const { file, service } = this.resolveLogCategory(req.url);

    const filePath: string = path.join(__dirname, '..', 'logs', `${!file ? "servers" : file}.json`);
    const TEMP_DATA: any = fs.readFileSync(filePath);
    const data = JSON.parse(TEMP_DATA);

    // Logger Varibles
    const LOGID = crypto.randomUUID();
    const DATENOW = new Date();

    // Make directories
    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    // Log varible
    const message: string = res.locals.responseMessage ? res.locals.responseMessage : res.statusMessage;
    const rowToken: string = await authMiddleware.getToken(req.headers.authorization, req.cookies, "accessToken");
    const token: string = !rowToken ? undefined : rowToken.split(".")[0];
    const level: LogLevel = !errorInfo ?
      Number(res.statusCode.toString().at(0)) === 4 ?
        "ERROR" :
        "INFO" :
      "FATAL";

    const newData: LoggerType =
    {
      logID: LOGID,
      timestamp: DATENOW,
      level: level,
      service: `${service}.service`,
      environment: process.env.NODE_ENV,
      message: message,

      // Request and response details
      // request
      request: {
        method: req.method,
        url: req.url,
        path: req.path,
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

      // User information
      user: {
        id: res.locals.user?.id,
        token: token && `${token}.****.****`,
        email: req.body?.username
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

    if (process.env.NODE_ENV == "development") {
      console.log(`\x1b[93m[${DATENOW}]  ${level}  ${req.method}  ${req.originalUrl}\x1b[0m`);
      console.log(`\x1b[93mRequestID: ${LOGID}  UserID: ${res.locals.user?.id}  IP: ${req.ip}\x1b[0m`);
      console.log(`\x1b[93mService: ${req.originalUrl}  Status Code: ${res.statusCode}  Duration: ${duration}\x1b[0m`);
      console.log(`\x1b[93mMessage: ${message}\x1b[0m`);
      console.log(chalk.dim("─".repeat(110)));
    }

  };

  /**
   * It performs logging when the request is completed.
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {number} next - Express next method (NextFunction)
   */
  // Solution: https://runebook.dev/en/docs/typescript/docs/handbook/2/classes/this-based-type-guards
  public middleware = (req: Request, res: Response, next: NextFunction): void => {

    // ? Varibles
    const initialPeriod: number = performance.now();

    // Response message
    this.getResponseMessage(res);

    res.on('finish', () => {
      try {

        this.create(req, res, performance.now() - initialPeriod);

      } catch (error: any) {
        throw new Error(error);
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

};