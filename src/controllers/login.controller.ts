import { Request, Response } from 'express';
// Services
import loginService from "../services/login.service";
// Utils
import { ExceptionHandlers } from '../utils/customExceptionHandlers';
// Types
import { responseType } from "../types/cusExceptionHandlers.type";

// Class
const exceptionHandlers = new ExceptionHandlers();

const loginControlRouter = async (req: Request, res: Response, username: string, password: string, responseType: responseType): Promise<void> => {

  await exceptionHandlers.authHandler(
    { file: "logins", level: "RESPONSE", logType: "login", service: "login.service" },
    responseType,
    req,
    res,
    () => loginService(username, password)
  );
};

export const loginWebController = async (req: Request, res: Response): Promise<void> => {
  // Datas
  const { username, password }: { username: string, password: string } = req.body;
  loginControlRouter(req, res, username, password, "web");
};

export const loginMobileController = async (req: Request, res: Response): Promise<void> => {
  // Datas
  const { username, password }: { username: string, password: string } = req.body
  loginControlRouter(req, res, username, password, "mobile");
};