import { Request, Response } from 'express';
// Services
import registerService from "../services/register.service";
// Types
import { authResponseType } from "../types/responses.type";
// Utils
import { AuthExceptionHandler } from '../utils/customErrorHandlers.util';

// Class
const AuthExceptionHandleTemp = new AuthExceptionHandler();

const registerController = async (req: Request, res: Response) => {

  // Datas
  const { firstname, lastname, username, email, password, dateOfBirth, country } = req.body;

  await AuthExceptionHandleTemp.Handle(
    { file: "registers", level: "RESPONSE", logType: "register", service: "register.service" },
    req,
    res,
    () => registerService({ firstname, lastname, username, email, password, dateOfBirth, country })
  );
};

export default registerController;