import { Request, Response } from 'express';
// Services
import { forgotPassword, resetPassword } from "../services/reset.service";
// Utils
import { AuthExceptionHandler } from '../utils/customErrorHandlers.util';
import { hashURLToken } from '../utils/urlTokens.util';

// Class
const AuthExceptionHandleTemp = new AuthExceptionHandler();


export const forgotPasswordController = async (req: Request, res: Response) => {

  // Datas
  const { email } = req.body;

  await AuthExceptionHandleTemp.Handle(
    { file: "resets", level: "RESPONSE", logType: "forgotpassword", service: "reset.service" },
    req,
    res,
    () => forgotPassword(email)
  );
};

export const resetPasswordController = async (req: Request, res: Response) => {

  // Datas
  const token: any = req.query.token;
  const hashedToken = hashURLToken(token);

  const { password, rePassword }: any = req.body;

  await AuthExceptionHandleTemp.Handle(
    { file: "resets", level: "RESPONSE", logType: "resetpassword", service: "reset.service" },
    req,
    res,
    () => resetPassword(hashedToken, password, rePassword)
  );
};