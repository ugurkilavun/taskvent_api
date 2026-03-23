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

const logoutService = async (accessToken: string, refreshToken: string, deviceInfo?: string, deviceLocation?: string): Promise<authResponseType> => {

  console.log("accessToken", accessToken);
  console.log("refreshToken", refreshToken);
  console.log("deviceInfo", deviceInfo);
  console.log("deviceLocation", deviceLocation);

  // const decodedAccessToken: any = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
  const decodedRefreshToken: any = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

  // console.log(decodedAccessToken);
  console.log(decodedRefreshToken);


  return {
    message: "Logged out successfully.",
    statusCode: 200,
  };
};

export default logoutService;