import { Request, Response } from 'express';
// Services
import refreshService from "../services/refresh.service";
import dotenv from 'dotenv';
// Middlewares
import { AuthMiddleware } from "../middlewares/auth.middleware";
// Utils
import { ExceptionHandlers } from '../utils/customExceptionHandlers';

// .env config
dotenv.config({ quiet: true });

// Class
const exceptionHandlers = new ExceptionHandlers();
const authMiddleware = new AuthMiddleware();

export const refreshWebController = async (req: Request, res: Response) => {
  // Datas
  const token: string | undefined = await authMiddleware.getToken(req.headers.authorization, req.cookies, "refreshToken");
  await exceptionHandlers.authHandler(
    "web",
    res,
    () => refreshService(token)
  );
};

export const refreshMobileController = async (req: Request, res: Response) => {
  // Datas
  const token: string | undefined = await authMiddleware.getToken(req.headers.authorization, req.cookies, "refreshToken");
  await exceptionHandlers.authHandler(
    "mobile",
    res,
    () => refreshService(token)
  );
};