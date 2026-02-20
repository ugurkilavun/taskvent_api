import { Request, Response } from 'express';
// Services
import registerService from "../services/register.service";
// Types
import { responseType } from "../types/cusExceptionHandlers.type";
// Utils
import { ExceptionHandlers } from '../utils/customExceptionHandlers';
// Typesi
import { UserType } from "../types/users.type";

// Class
const exceptionHandlers = new ExceptionHandlers();

const registerControlRouter = async (req: Request, res: Response, registerType: UserType, responseType: responseType): Promise<void> => {

  await exceptionHandlers.authHandler(
    { file: "registers", level: "RESPONSE", logType: "register", service: "register.service" },
    responseType,
    req,
    res,
    () => registerService(registerType)
  );
};

export const registerWebController = async (req: Request, res: Response): Promise<void> => {
  // Datas
  const { firstname, lastname, username, email, password, dateOfBirth, country }: UserType = req.body;
  registerControlRouter(req, res, { firstname, lastname, username, email, password, dateOfBirth, country }, "web");
};

export const registerMobileController = async (req: Request, res: Response): Promise<void> => {
  // Datas
  const { firstname, lastname, username, email, password, dateOfBirth, country }: UserType = req.body;
  registerControlRouter(req, res, { firstname, lastname, username, email, password, dateOfBirth, country }, "mobile");
};