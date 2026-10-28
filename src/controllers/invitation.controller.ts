import { Request, Response } from 'express';
// Services
import { acceptInvitationService, rejectInvitationService } from "../services/invitation.service";
// Utils
import catchAsync from '../utils/catchAsync.util';
import { HttpResponse } from "../utils/response.util";
// Types
import { defaultResponseType } from "../types/responses.type";

// Class
const httpResponse = new HttpResponse();

export const acceptInvitationController = catchAsync(async (req: Request, res: Response): Promise<void> => {
  // Datas
  const token = req.params.token as string;
  const { message, statusCode }: defaultResponseType = await acceptInvitationService(token);

  httpResponse.default(res, message, statusCode);
});

export const rejectInvitationController = catchAsync(async (req: Request, res: Response): Promise<void> => {
  // Datas
  const token = req.params.token as string;
  const { message, statusCode }: defaultResponseType = await rejectInvitationService(token);

  httpResponse.default(res, message, statusCode);
});
