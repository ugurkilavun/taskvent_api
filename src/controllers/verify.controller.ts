import { Request, Response } from 'express';
// Services
import verifyService from "../services/verify.service";
// Utils
import { AuthExceptionHandler } from '../utils/customErrorHandlers.util';

// Class
const AuthExceptionHandlerTemp = new AuthExceptionHandler();

const verifyController = async (req: Request, res: Response) => {

  // Data
  const token: string = req.query.token.toString();

  await AuthExceptionHandlerTemp.Handle(
    { file: "verifications", level: "RESPONSE", logType: "verify", service: "verify.service" },
    req,
    res,
    () => verifyService(token)
  );
};

export default verifyController;