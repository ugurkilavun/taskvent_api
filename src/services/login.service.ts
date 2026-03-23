import bcrypt from "bcrypt";
// Utils
import { signToken } from "../utils/jwt.util";
import { statusCodeErrors } from "../utils/customErrors.util";
// Repositories
import { UserRepository } from "../repositories/user.repository";
// Types
import { authResponseType } from "../types/responses.type";
// Services
import { usernameRegex, emailRegex } from "./availability.service";

// Class
const userRepository = new UserRepository();

const loginService = async (username?: string, password?: string): Promise<authResponseType> => {

  if (username === undefined || password === undefined) throw new statusCodeErrors("Incomplete data.", 400);

  if (!usernameRegex.test(username) && !emailRegex.test(username)) throw new statusCodeErrors("Invalid username or email.", 400);

  let userDATAS: any;
  if (usernameRegex.test(username)) userDATAS = await userRepository.findByEmailOrUsername(username.toLowerCase());
  if (emailRegex.test(username)) userDATAS = await userRepository.findByEmailOrUsername(username);

  if (!userDATAS) throw new statusCodeErrors("Username or email not found.", 401);

  const passwdResult = await bcrypt.compare(password, userDATAS.password);
  if (!passwdResult) throw new statusCodeErrors("Username or email not found.", 401);

  const ACCESS_TOKEN: string = signToken(
    {
      id: (userDATAS._id).toJSON(),
      username: userDATAS.username,
      createdAt: new Date()
    },
    "access"
  ); // 15m
  const REFRESH_TOKEN: string = signToken(
    {
      id: (userDATAS._id).toJSON(),
      username: userDATAS.username,
      createdAt: new Date()
    },
    "refresh",
  ); // 365d

  return {
    message: "Login successful.",
    statusCode: 200,
    accessToken: ACCESS_TOKEN,
    refreshToken: REFRESH_TOKEN,
  };

};

export default loginService;