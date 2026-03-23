import { Response } from "express";
// configs
import appConfig from "../configs/app.config";
// Types
import { platformType } from "../types/platform.type";

export class HttpResponse {

  /**
   * Sends the authentication response using a platform-specific strategy.
   * @param res - The Express Response object.
   * @param statusCode - HTTP status code (e.g., 200, 201).
   * @param platform - Client type ('web' or 'mobile'). Defaults to 'mobile'.
   * @param data - Payload containing tokens (accessToken, refreshToken) and response messages.
   */
  // https://www.geeksforgeeks.org/typescript/what-is-the-record-type-in-typescript/
  // Record<Keys, Type>
  public auth(
    res: Response,
    statusCode: number,
    platform: platformType = "mobile",
    data: Record<string, string>
  ): void {

    if (platform === "mobile") {
      res.status(statusCode).json(data);
    };

    if (platform === "web") {
      res
        .status(statusCode)
        .cookie('accessToken', data.accessToken, {
          httpOnly: true,
          secure: appConfig.nodeEnv === "production",
          sameSite: 'strict',
          // maxAge: 15 * 60 * 1000 // 15 min.
        })
        .cookie('refreshToken', data.refreshToken, {
          httpOnly: true,
          secure: appConfig.nodeEnv === "production",
          sameSite: 'strict',
          // maxAge: 7 * 24 * 60 * 60 * 1000 // 7 day.
        })
        .json({ message: data.message });
    };
  };

  /**
   * Descption
   * @param res - The Express Response object.
   * @param message - A descriptive message providing context about the status.
   * @param statusCode - HTTP status code (e.g., 20*).
   * @param available - A boolean indicating whether the resource is available or not.
   */
  public availability(
    res: Response,
    message: string,
    statusCode: number,
    available: boolean
  ): void {
    res.status(statusCode).json({ message, available });
  };

  /**
   * Sends a standard response.
   * @param res - The Express Response object.
   * @param message - A descriptive message providing context about the status.
   * @param statusCode - HTTP status code (e.g., 20*).
   * @param data - Optional array of objects containing the requested resources or details.
   */
  public default(
    res: Response,
    message: string,
    statusCode: number,
    data?: Array<object>
  ): void {
    res.status(statusCode).json({ message, data });
  };

};