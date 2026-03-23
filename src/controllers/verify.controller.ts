import { Request, Response } from 'express';
// Services
import verifyService from "../services/verify.service";
// Utils
import catchAsync from "../utils/catchAsync.util";
import { HttpResponse } from "../utils/response.util";
// Types
import { defaultResponseType } from "../types/responses.type";

// Class
const httpResponse = new HttpResponse();

const verifyController = catchAsync(async (req: Request, res: Response): Promise<void> => {

  // Data
  const token: string = req.params.token.toString();

  const { message, statusCode }: defaultResponseType = await verifyService(token);

  httpResponse.default(res, message, statusCode);
});

export default verifyController;