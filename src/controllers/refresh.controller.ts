import { Request, Response } from 'express';
// Services
import refreshService from "../services/refresh.service";
import dotenv from 'dotenv';
// Middlewares
import { AuthMiddleware } from "../middlewares/auth.middleware";
// Utils
import { ExceptionHandlers } from '../utils/customExceptionHandlers';
import { statusCodeErrors } from '../utils/customErrors.util';

import catchAsync from "../utils/catchAsync.util";

// .env config
dotenv.config({ quiet: true });

// Class
const exceptionHandlers = new ExceptionHandlers();
const authMiddleware = new AuthMiddleware();

// export const refreshController = (req: Request, res: Response): any => {
//   // // Datas
//   // const { token: refreshToken, client }:
//   //   { token: string | undefined, client: "web" | "mobile" } = await authMiddleware.resolveTokenSource(req.headers.authorization, req.cookies, "refreshToken");

//   // const { token: accessToken }:
//   //   { token: string | undefined } = await authMiddleware.resolveTokenSource(req.headers.authorization, req.cookies, "accessToken");

//   // // const refreshData = await authMiddleware.resolveTokenSource(req.headers.authorization, req.cookies, "refreshToken");
//   // console.log("accessToken:", accessToken);
//   // console.log("\n\rrefreshToken:", refreshToken);
//   // console.log("\n\rclient:", client);
//   // // throw new Error("test");

//   // await exceptionHandlers.authHandler(
//   //   client,
//   //   res,
//   //   () => refreshService(accessToken, refreshToken, client)
//   // );
//   // throw new statusCodeErrors("Token is invalid.1", 401);


//   return refreshService(res);
// };

export const refreshController = catchAsync(async (req: Request, res: Response): Promise<void> => {

});
//   // // Datas
//   // const { token: refreshToken, client }:
//   //   { token: string | undefined, client: "web" | "mobile" } = await authMiddleware.resolveTokenSource(req.headers.authorization, req.cookies, "refreshToken");

//   // const { token: accessToken }:
//   //   { token: string | undefined } = await authMiddleware.resolveTokenSource(req.headers.authorization, req.cookies, "accessToken");

//   // // const refreshData = await authMiddleware.resolveTokenSource(req.headers.authorization, req.cookies, "refreshToken");
//   // console.log("accessToken:", accessToken);
//   // console.log("\n\rrefreshToken:", refreshToken);
//   // console.log("\n\rclient:", client);
//   // // throw new Error("test");

//   // await exceptionHandlers.authHandler(
//   //   client,
//   //   res,
//   //   () => refreshService(accessToken, refreshToken, client)
//   // );
//   // throw new statusCodeErrors("Token is invalid.1", 401);

