import { Request, Response } from 'express';
// Services
import registerService from "../services/register.service";
// Utils
import catchAsync from '../utils/catchAsync.util';
import { HttpResponse } from '../utils/response.util';
// Types
import { UserType } from "../types/users.type";
import { authResponseType } from '../types/responses.type';

// Class
const httpResponse = new HttpResponse();

export const registerWebController = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { firstname, lastname, username, email, password, dateOfBirth, country }: UserType = req.body;
  const { message, statusCode, accessToken, refreshToken }: authResponseType = await registerService({ firstname, lastname, username, email, password, dateOfBirth, country })

  httpResponse.auth(res, statusCode, "web", { message, accessToken, refreshToken });
});

export const registerMobileController = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { firstname, lastname, username, email, password, dateOfBirth, country }: UserType = req.body;
  const { message, statusCode, accessToken, refreshToken }: authResponseType = await registerService({ firstname, lastname, username, email, password, dateOfBirth, country })

  httpResponse.auth(res, statusCode, "mobile", { message, accessToken, refreshToken });
});