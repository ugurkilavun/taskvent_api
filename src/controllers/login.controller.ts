import { Request, Response } from 'express';
// Services
import loginService from "../services/login.service";
// Utils
import { AuthExceptionHandler } from '../utils/customErrorHandlers.util';

// Class
const AuthExceptionHandleTemp = new AuthExceptionHandler();

const loginController = async (req: Request, res: Response) => {

  // Datas
  const { username, password } = req.body;

  await AuthExceptionHandleTemp.Handle(
    { file: "logins", level: "RESPONSE", logType: "login", service: "login.service" },
    req,
    res,
    () => loginService(username, password)
  );
};

export default loginController;