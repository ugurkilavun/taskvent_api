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

const refreshService = async (token: string | undefined): Promise<authResponseType> => {

  if (!token) throw new statusCodeErrors("Token is missing.", 401);

  const tokenDATA: any = jwt.verify(token, process.env.REFRESH_SECRET);

  const userDATAS: any = await userRepository.findById(tokenDATA.id);
  if (!userDATAS) throw new statusCodeErrors("Token invalid or expired.", 401);

  const payload: payloadType = {
    id: (userDATAS._id).toJSON(),
    username: userDATAS.username,
    createdAt: new Date()
  };

  const ACCESS_TOKEN: string = signToken(payload, "access", '15m'); // 15m

  return {
    message: "Token created.",
    accessToken: ACCESS_TOKEN,
    HTTPStatusCode: 200,
  };
};

export default refreshService;