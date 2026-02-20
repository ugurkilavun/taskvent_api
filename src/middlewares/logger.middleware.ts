import fs from "fs";
import crypto from "crypto";
import path from "path";
import chalk from "chalk";
// Types
import { loggerType } from "../types/logger.type";

export class Logger {

  // constructor() {
  //   this.message = message;
  // }

  public create(loggerType: loggerType, { file, seeLogConsole }: { file: string, seeLogConsole: boolean }) {
    try {

      const filePath: string = path.join(__dirname, '..', 'logs', `${file}.json`);
      const TEMP_DATA: any = fs.readFileSync(filePath);
      const data = JSON.parse(TEMP_DATA);

      // Logger Var
      const REQUESTID = crypto.randomUUID();
      const DATENOW = new Date();

      // Make directories
      fs.mkdirSync(path.dirname(filePath), { recursive: true });

      const newData: loggerType =
      {
        requestID: REQUESTID,
        timestamp: DATENOW,
        level: loggerType.level,
        logType: loggerType.logType,
        message: loggerType.message,
        service: loggerType.service,
        userID: loggerType.userID,
        token: loggerType?.token,
        username: loggerType?.username,
        ip: loggerType.ip,
        endpoint: loggerType.endpoint,
        method: loggerType.method,
        userAgent: loggerType.userAgent,
        statusCode: loggerType.statusCode,
        durationMs: loggerType.durationMs,
        details: {
          error: loggerType.details?.error,
          stack: loggerType.details?.stack
        }
      };

      data.push(newData);

      const jsonData = JSON.stringify(data, null, 2);

      fs.writeFileSync(filePath, jsonData, 'utf8');

      if (seeLogConsole) {
        console.log(`\x1b[93m[${DATENOW}]  ${loggerType.level}  ${loggerType.method}  ${loggerType.endpoint}\x1b[0m`);
        console.log(`\x1b[93mRequestID: ${REQUESTID}  UserID: ${loggerType.userID}  IP: ${loggerType.ip}\x1b[0m`);
        console.log(`\x1b[93mService: ${loggerType.service}  Status Code: ${loggerType.statusCode}  Duration: ${loggerType.durationMs}\x1b[0m`);
        console.log(`\x1b[93mMessage: ${loggerType.message}\x1b[0m`);
        console.log(chalk.dim("─".repeat(110)));
      };

    } catch (error: any) {
      console.log("[LOGGER ERROR]", error.message);
    }

  };
};