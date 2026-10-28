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
import { platformType } from '../types/platform.type';
import jwtConfig from "../configs/jwt.config";

// Class
const userRepository = new UserRepository();

const refreshService = async (accessToken: string | undefined, refreshToken: string, platform: platformType | undefined): Promise<authResponseType> => {

  if (!refreshToken) throw new statusCodeErrors("Token is missing.", 401);

  if (!accessToken || !refreshToken || !platform) throw new statusCodeErrors("Token is missing or invalid.", 401);

  const decodedAccessToken: any = jwt.decode(accessToken);
  const decodedRefreshToken: any = jwt.verify(refreshToken, jwtConfig.refreshSecret);

  if (decodedAccessToken.id !== decodedRefreshToken.id && decodedAccessToken.username !== decodedRefreshToken.username) throw new statusCodeErrors("Session validation failed.", 401);

  const userDATAS: any = await userRepository.findById(decodedAccessToken.id);
  if (!userDATAS) throw new statusCodeErrors("Token is invalid.", 401);

  const payload: payloadType = {
    id: (userDATAS._id).toJSON(),
    username: userDATAS.username,
    createdAt: new Date()
  };

  const ACCESS_TOKEN: string = signToken(payload, "access"); // 15m

  return {
    message: "Token created.",
    statusCode: 200,
    accessToken: ACCESS_TOKEN,
  };
};

export default refreshService;