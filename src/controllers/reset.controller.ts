import { Request, Response } from 'express';
// Services
import { forgotPassword, resetPassword } from "../services/reset.service";
// Utils
import { ExceptionHandlers } from '../utils/customExceptionHandlers';
import { URLToken } from '../utils/urlTokens.util';

// Class
const exceptionHandlers = new ExceptionHandlers();
const urlToken = new URLToken;


export const forgotPasswordController = async (req: Request, res: Response) => {

  // Datas
  const { email } = req.body;

  await exceptionHandlers.authHandler(
    { file: "resets", level: "RESPONSE", logType: "forgotpassword", service: "reset.service" },
    "mobile",
    req,
    res,
    () => forgotPassword(email)
  );
};

export const resetPasswordController = async (req: Request, res: Response) => {

  // Datas
  const token: any = req.params.token;
  const hashedToken = urlToken.hash(token);

  const { password, rePassword }: any = req.body;

  await exceptionHandlers.authHandler(
    { file: "resets", level: "RESPONSE", logType: "resetpassword", service: "reset.service" },
    "mobile",
    req,
    res,
    () => resetPassword(hashedToken, password, rePassword)
  );
};