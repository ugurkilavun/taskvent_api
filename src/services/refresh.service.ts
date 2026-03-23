import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
// Errors
import { statusCodeErrors } from "../utils/customErrors.util";
import { signToken } from '../utils/jwt.util';
// Repositories
import { UserRepository } from "../repositories/user.repository";
// Types
import { authResponseType } from '../types/responses.type';
import { payloadType } from "../types/jwt.type";

// .env config
dotenv.config({ quiet: true });

// Class
const userRepository = new UserRepository();

const refreshService = async (res: Response): Promise<void> => {

  const userDATAS: any = await userRepository.findById(res.locals.user.id);
  if (!userDATAS) throw new statusCodeErrors("Token is invalid.", 401);

  const payload: payloadType = {
    id: (userDATAS._id).toJSON(),
    username: userDATAS.username,
    createdAt: new Date()
  };

  const ACCESS_TOKEN: string = signToken(payload, "access"); // 15m

  if (res.locals.client === "web") {
    res
      .status(200)
      .cookie('accessToken', ACCESS_TOKEN, {
        httpOnly: true,
        secure: true, // process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        // maxAge: 15 * 60 * 1000 // 15 min.
      })
      .json({
        message: "Token created",
      });
  }

  if (res.locals.client === "mobile") {
    res.status(200).json({ message: "Token created.", accessToken: ACCESS_TOKEN });
  }

};

export default refreshService;