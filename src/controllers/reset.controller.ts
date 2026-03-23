import { Request, Response } from 'express';
// Services
import { forgotPassword, resetPassword } from "../services/reset.service";
// Utils
// import { ExceptionHandlers } from '../utils/customExceptionHandlers';
import { URLToken } from '../utils/urlTokens.util';
import catchAsync from "../utils/catchAsync.util";
import { HttpResponse } from "../utils/response.util";
// Types
import { defaultResponseType } from "../types/responses.type";

// Class
const httpResponse = new HttpResponse();
const urlToken = new URLToken();

export const forgotPasswordController = catchAsync(async (req: Request, res: Response) => {

  // Datas
  const { email } = req.body;

  const { message, statusCode }: defaultResponseType = await forgotPassword(email);

  httpResponse.default(res, message, statusCode);
});

export const resetPasswordController = catchAsync(async (req: Request, res: Response) => {

  // Datas
  const token: string = req.params.token as string;
  const hashedToken = urlToken.hash(token);

  const { password, rePassword }: any = req.body;

  const { message, statusCode }: defaultResponseType = await resetPassword(hashedToken, password, rePassword);

  httpResponse.default(res, message, statusCode);
});