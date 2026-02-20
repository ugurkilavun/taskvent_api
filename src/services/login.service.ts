import bcrypt from "bcrypt";
// Utils
import { signToken } from "../utils/jwt.util";
import { statusCodeErrors } from "../utils/customErrors.util";
// Repositories
import { UserRepository } from "../repositories/user.repository";
// Types
import { authResponseType } from "../types/responses.type";

// Class
const userRepository = new UserRepository();

const loginService = async (username?: string, password?: string): Promise<authResponseType> => {

  if (username === undefined || password === undefined) throw new statusCodeErrors("Incomplete data.", 400)

  const userDATAS: any = await userRepository.findByEmailOrUsername(username);
  if (!userDATAS) throw new statusCodeErrors("Username or email not found.", 401);

  const passwdResult = await bcrypt.compare(password, userDATAS.password);
  if (!passwdResult) throw new statusCodeErrors("Username or email not found.", 401);

  const ACCESS_TOKEN: string = signToken({
    id: (userDATAS._id).toJSON(),
    username: userDATAS.username,
    createdAt: new Date()
  },
    "access", '15m'
  ); // 15m
  const REFRESH_TOKEN: string = signToken({
    id: (userDATAS._id).toJSON(),
    username: userDATAS.username,
    createdAt: new Date()
  },
    "refresh", '60d'
  ); // 60d

  return {
    message: "Login successful.",
    accessToken: ACCESS_TOKEN,
    refreshToken: REFRESH_TOKEN,
    HTTPStatusCode: 200,
  };

};

export default loginService;