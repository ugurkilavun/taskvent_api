import { Request, Response } from 'express';
// Services
import logoutService from "../services/logout.service";
// Utils
// import { ExceptionHandlers } from '../utils/customExceptionHandlers';
// Middlewares
import { AuthMiddleware } from "../middlewares/auth.middleware";

// Class
// const exceptionHandlers = new ExceptionHandlers();
const authMiddleware = new AuthMiddleware();

export const logoutController = async (req: Request, res: Response): Promise<void> => {
  // // Datas
  // const { refreshToken, deviceInfo, deviceLocation }:
  //   { refreshToken: string, deviceInfo?: string, deviceLocation?: string } = req.body;
  // const { token }: { token: string } = await authMiddleware.resolveTokenSource(req.headers.authorization, req.cookies, "accessToken");

  // await exceptionHandlers.authHandler(
  //   "mobile",
  //   res,
  //   () => logoutService(token, refreshToken, deviceInfo, deviceLocation)
  // );
};
