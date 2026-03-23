import { Request, Response } from 'express';
// Services
import { usernameAvailabilityService, emailAvailabilityService } from "../services/availability.service";
// Utils
import catchAsync from '../utils/catchAsync.util';
import { HttpResponse } from "../utils/response.util";
// Types
import { authAvailabilityType } from "../types/responses.type";

// Class
const httpResponse = new HttpResponse();

export const usernameAvailabilityController = catchAsync(async (req: Request, res: Response): Promise<void> => {
  // Datas
  const username = req.params.username as string | undefined;
  const { message, statusCode, available }: authAvailabilityType = await usernameAvailabilityService(username);

  httpResponse.availability(res, message, statusCode, available);
});

export const emailAvailabilityController = catchAsync(async (req: Request, res: Response): Promise<void> => {
  // Datas
  const email = req.params.email as string | undefined;
  const { message, statusCode, available }: authAvailabilityType = await emailAvailabilityService(email);

  httpResponse.availability(res, message, statusCode, available);
});