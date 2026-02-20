import bcrypt from "bcrypt";
// Utils
import { statusCodeErrors } from "../utils/customErrors.util";
import { URLToken } from "../utils/urlTokens.util";
// Repositories
import { UserRepository } from "../repositories/user.repository";
import { ResetRepository } from "../repositories/reset.repository";
// Types
import { authResponseType } from "../types/responses.type";
// Services
import { sendPasswordResetLink } from "./mail.service";

// Class
const urlToken = new URLToken();
const resetRepository = new ResetRepository();
const userRepository = new UserRepository();

// * Forgot password
export const forgotPassword = async (email?: string): Promise<authResponseType> => {

  if (email === undefined) throw new statusCodeErrors("Incomplete data.", 400);

  const DATA: any = await userRepository.findByEmail(email);
  if (!DATA) throw new statusCodeErrors("If an account with that email exists, we have sent password reset instructions.", 200);

  // * Generate URL Token
  const urlTokenDATA: string = urlToken.generate();
  const hashedToken = urlToken.hash(urlTokenDATA);

  const resetIn = await resetRepository.insertReset({
    id: DATA._id.toString(),
    token: hashedToken,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 Minutes
    used: false
  });
  if (!resetIn) throw new statusCodeErrors("If an account with that email exists, we have sent password reset instructions.", 200);

  // * Send Password Reset Link
  sendPasswordResetLink({
    to: DATA.email,
    name: `${DATA.firstname} ${DATA.lastname}`,
    resetUrl: `${process.env.URL}/resetPassword/${urlTokenDATA}`,
    lang: DATA.country
  });

  return {
    message: "If an account with that email exists, we have sent password reset instructions.",
    HTTPStatusCode: 200
  };
};

// * Reset password
export const resetPassword = async (token?: string, password?: string, rePassword?: string): Promise<authResponseType> => {

  // Token: Undefined
  if (token === undefined) throw new statusCodeErrors("Incomplete data.", 400);

  // Passwords: Undefined
  if (password === undefined || rePassword === undefined) throw new statusCodeErrors("Incomplete data.", 400);

  // Is match
  if (password !== rePassword) throw new statusCodeErrors("Passwords do not match.", 400);

  const TOKEN_: any = await resetRepository.findReset(token);

  if (!TOKEN_) throw new statusCodeErrors("Invalid token!", 401);
  if (TOKEN_.expiresAt < new Date()) throw new statusCodeErrors("The token has expired.", 401);
  if (TOKEN_.used) throw new statusCodeErrors("The token has already been used.", 401);

  const salt: string = bcrypt.genSaltSync(10);
  const paswdHash: string = bcrypt.hashSync(password, salt);

  const passwordBeenUpdated: any = await userRepository.updatePasswordWithId(TOKEN_.id, paswdHash);
  if (!passwordBeenUpdated) throw new statusCodeErrors("Update error.", 400);

  const tokenBeenUpdated = await resetRepository.updateReset(TOKEN_.id, TOKEN_.token);
  if (!tokenBeenUpdated) throw new statusCodeErrors("Update error.", 400);

  return {
    message: "The password has been successfully updated.",
    HTTPStatusCode: 200
  };
};