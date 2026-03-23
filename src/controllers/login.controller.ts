import { Request, Response } from 'express';
// Services
import loginService from "../services/login.service";
// Utils
import catchAsync from '../utils/catchAsync.util';
import { HttpResponse } from "../utils/response.util";
// Types
import { authResponseType } from "../types/responses.type";

// Class
const httpResponse = new HttpResponse();

export const loginWebController = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { username, password }: { username: string, password: string } = req.body;
  const { message, statusCode, accessToken, refreshToken }: authResponseType = await loginService(username, password);

  httpResponse.auth(res, statusCode, "web", { message, accessToken, refreshToken });
});

export const loginMobileController = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { username, password }: { username: string, password: string } = req.body;
  const { message, statusCode, accessToken, refreshToken }: authResponseType = await loginService(username, password);

  httpResponse.auth(res, statusCode, "mobile", { message, accessToken, refreshToken });
});