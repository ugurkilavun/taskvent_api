import bcrypt from "bcrypt";
import dotenv from 'dotenv';
// Utils
import { signToken } from "../utils/jwt.util";
import { statusCodeErrors } from "../utils/customErrors.util";
import { URLToken } from "../utils/urlTokens.util";
// Repositories
import { UserRepository } from "../repositories/user.repository";
import { VerifyRepository } from "../repositories/verify.repository";
// Types
import { UserType } from "../types/users.type";
import { authResponseType } from "../types/responses.type";
// Services
import { sendVerificationEmail } from "./mail.service";
import { usernameRegex, emailRegex } from "./availability.service";

import  appConfig from "../configs/app.config";

// Class
const userRepository = new UserRepository;
const verifyRepository = new VerifyRepository;
const urlToken = new URLToken();

const registerService = async (DATA: UserType): Promise<authResponseType> => {

  if (Object.values(DATA).some(x => x === undefined)) throw new statusCodeErrors("Incomplete data.", 400);

  const UsernameLowerCase: string = DATA.username.toLowerCase();

  if (!usernameRegex.test(DATA.username.toLowerCase())) throw new statusCodeErrors("Invalid username.", 400);
  if (!emailRegex.test(DATA.email)) throw new statusCodeErrors("Invalid email format.", 400);

  const username_: unknown = await userRepository.checkEmailOrUsername(UsernameLowerCase);
  if (username_) throw new statusCodeErrors("Username already exists.", 409);

  const email_: any = await userRepository.checkEmailOrUsername(DATA.email);
  if (email_) throw new statusCodeErrors("Email already exists.", 409);

  const salt = bcrypt.genSaltSync(10);
  const paswdHash = bcrypt.hashSync(DATA.password, salt);

  // * Generate URL Token
  const urlTokenDATA: string = urlToken.generate();
  const hash_URLToken = urlToken.hash(urlTokenDATA);

  // * Insert user
  const userIn: any = await userRepository.insertUser({
    firstname: DATA.firstname,
    lastname: DATA.lastname,
    username: UsernameLowerCase,
    email: DATA.email,
    password: paswdHash,
    dateOfBirth: DATA.dateOfBirth,
    country: DATA.country,
    verifiedAccount: false
  });
  if (!userIn) throw new statusCodeErrors("Registration failed.", 400);

  // * Insert verify
  const verifyIn: unknown = await verifyRepository.insertVerify({
    id: userIn._id.toString(),
    token: hash_URLToken,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    used: false
  });
  if (!verifyIn) throw new statusCodeErrors("Email verification URL could not be created.", 400);

  // * Send Verification Email
  sendVerificationEmail({
    to: DATA.email,
    name: `${DATA.firstname} ${DATA.lastname}`,
    verificationUrl: `${appConfig.url}/auth/verify/${urlTokenDATA}`,
    lang: DATA.country
  });

  const ACCESS_TOKEN: string = signToken(
    {
      id: (userIn._id).toJSON(),
      username: userIn.username,
      createdAt: new Date()
    },
    "access"
  );
  const REFRESH_TOKEN: string = signToken(
    {
      id: (userIn._id).toJSON(),
      username: userIn.username,
      createdAt: new Date()
    },
    "refresh"
  );

  return {
    message: "Registration Successful.",
    statusCode: 201,
    accessToken: ACCESS_TOKEN,
    refreshToken: REFRESH_TOKEN,
  };
};

export default registerService;