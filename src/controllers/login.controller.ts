import { Request, Response } from 'express';
// Services
import loginService from "../services/login.service";
// Utils
import { ExceptionHandlers } from '../utils/customExceptionHandlers';

// Class
const exceptionHandlers = new ExceptionHandlers();

export const loginWebController = async (req: Request, res: Response): Promise<void> => {
  // Datas
  const { username, password }: { username: string, password: string } = req.body;
  await exceptionHandlers.authHandler(
    "web",
    res,
    () => loginService(username, password)
  );
};

export const loginMobileController = async (req: Request, res: Response): Promise<void> => {
  // Datas
  const { username, password }: { username: string, password: string } = req.body;
  await exceptionHandlers.authHandler(
    "mobile",
    res,
    () => loginService(username, password)
  );
};