import { Request, Response } from 'express';
// Services
import registerService from "../services/register.service";
// Utils
import { ExceptionHandlers } from '../utils/customExceptionHandlers';
// Typesi
import { UserType } from "../types/users.type";

// Class
const exceptionHandlers = new ExceptionHandlers();

export const registerWebController = async (req: Request, res: Response): Promise<void> => {
  // Datas
  const { firstname, lastname, username, email, password, dateOfBirth, country }: UserType = req.body;
  await exceptionHandlers.authHandler(
    "web",
    res,
    () => registerService({ firstname, lastname, username, email, password, dateOfBirth, country })
  );
};

export const registerMobileController = async (req: Request, res: Response): Promise<void> => {
  // Datas
  const { firstname, lastname, username, email, password, dateOfBirth, country }: UserType = req.body;
  await exceptionHandlers.authHandler(
    "mobile",
    res,
    () => registerService({ firstname, lastname, username, email, password, dateOfBirth, country })
  );
};