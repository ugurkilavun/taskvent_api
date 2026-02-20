import { Request, Response } from 'express';
// Services
import verifyService from "../services/verify.service";
// Utils
import { ExceptionHandlers } from '../utils/customExceptionHandlers';

// Class
const exceptionHandlers = new ExceptionHandlers();

const verifyController = async (req: Request, res: Response) => {

  // Data
  const token: string = req.query.token.toString();

  await exceptionHandlers.authHandler(
    { file: "verifications", level: "RESPONSE", logType: "verify", service: "verify.service" },
    "mobile",
    req,
    res,
    () => verifyService(token)
  );
};

export default verifyController;