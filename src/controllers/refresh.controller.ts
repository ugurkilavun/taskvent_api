import { Request, Response } from 'express';
// Services
import refreshService from "../services/refresh.service";
import dotenv from 'dotenv';
// Middlewares
import { AuthMiddleware } from "../middlewares/auth.middleware";
// Utils
import { ExceptionHandlers } from '../utils/customExceptionHandlers';
// Repositories
// Types
import { responseType } from "../types/cusExceptionHandlers.type";

// .env config
dotenv.config({ quiet: true });

// Class
const exceptionHandlers = new ExceptionHandlers();
const authMiddleware = new AuthMiddleware();

const refreshControlRouter = async (req: Request, res: Response, token: string | undefined, responseType: responseType): Promise<void> => {

  await exceptionHandlers.authHandler(
    { file: "refreshes", level: "RESPONSE", logType: "refresh", service: "refresh.service" },
    responseType,
    req,
    res,
    () => refreshService(token)
  );
};

export const refreshWebController = async (req: Request, res: Response) => {

  // Datas
  const token: string | undefined = await authMiddleware.getToken(req.headers.authorization, req.cookies, "refreshToken");
  refreshControlRouter(req, res, token, "web");
};

export const refreshMobileController = async (req: Request, res: Response) => {

  // Datas
  const token: string | undefined = await authMiddleware.getToken(req.headers.authorization, req.cookies, "refreshToken");
  refreshControlRouter(req, res, token, "mobile");
};