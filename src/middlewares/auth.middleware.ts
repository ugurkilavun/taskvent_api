import jwt, { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
// Utils
import { statusCodeErrors } from '../utils/customErrors.util';

export class AuthMiddleware {

  public async getToken(mobileToken: string | undefined, webToken: any | undefined, tokentype: "accessToken" | "refreshToken"): Promise<string | undefined> {

    if (mobileToken?.startsWith("Bearer ") && webToken[tokentype]) throw new statusCodeErrors("Multiple authentication methods provided.", 400);

    /// Mobile / API clients: req.headers.authorization
    if (mobileToken?.startsWith("Bearer ")) return mobileToken.split(" ")[1]

    // Web: req.cookies
    if (webToken[tokentype]) return webToken[tokentype];

    return undefined;
  };

  // Solution: https://runebook.dev/en/docs/typescript/docs/handbook/2/classes/this-based-type-guards
  public checkToken = async (req: Request, res: Response, next: NextFunction): Promise<any> => {

    try {
      // Initial Check
      if (!req.headers.authorization && !req.cookies) throw new statusCodeErrors("Token is missing or invalid.", 401);;

      const token: any = await this.getToken(req.headers.authorization, req.cookies, "accessToken");
      if (!token) throw new statusCodeErrors("Token is invalid.", 401);

      const decoded: any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      res.locals.user = { id: decoded.id, username: decoded.username };

      next();
    } catch (error: any) {

      if (error instanceof statusCodeErrors) {

        res.status(error.statusCode).json({
          message: error.message,
        });

      } else if (error instanceof TokenExpiredError) {

        res.status(401).json({
          message: "Access token has expired.",
          error: "TOKEN_EXPIRED"
        });

      } else if (error instanceof JsonWebTokenError)

        res.status(401).json({
          message: "Access token invalid.",
          error: "INVALID_TOKEN"
        });

      else throw new Error(error);

    }
  }

};