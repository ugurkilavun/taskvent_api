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

// .env config
dotenv.config({ quiet: true });

// Class
const userRepository = new UserRepository;
const verifyRepository = new VerifyRepository;

// Class
const urlToken = new URLToken();

// Email format validation
const validEmail = (email: string): boolean => {
  const pattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
};

const registerService = async (DATA: UserType): Promise<authResponseType> => {

  if (Object.values(DATA).some(x => x === undefined)) throw new statusCodeErrors("Incomplete data.", 400);

  if (!validEmail(DATA.email)) throw new statusCodeErrors("Invalid email format.", 400);

  const username_: unknown = await userRepository.checkEmailOrUsername(DATA.username);
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
    username: DATA.username,
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
    verificationUrl: `${process.env.URL}/verify?token=${urlTokenDATA}`,
    lang: DATA.country
  });

  const ACCESS_TOKEN: string = signToken({
    id: (userIn._id).toJSON(),
    username: userIn.username,
    createdAt: new Date()
  },
    "access", '15m'
  );
  const REFRESH_TOKEN: string = signToken({
    id: (userIn._id).toJSON(),
    username: userIn.username,
    createdAt: new Date()
  },
    "refresh", '60d'
  );

  return {
    message: "Registration Successful.",
    accessToken: ACCESS_TOKEN,
    refreshToken: REFRESH_TOKEN,
    HTTPStatusCode: 201
  };
};

export default registerService;