import { statusCodeErrors } from "../utils/customErrors.util";
// Repositories
import { UserRepository } from "../repositories/user.repository";
// Types
import { authAvailabilityType } from "../types/responses.type";

// Class
const userRepository = new UserRepository();

// Global datas
export const usernameRegex: RegExp = /^[a-zA-Z0-9_]{3,25}$/;
export const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const usernameAvailabilityService = async (username?: string): Promise<authAvailabilityType> => {

  if (username === undefined) throw new statusCodeErrors("Incomplete data.", 400);

  const UsernameLowerCase: string = username.toLowerCase();

  if (!usernameRegex.test(UsernameLowerCase)) throw new statusCodeErrors("Username can only contain letters, numbers, and underscores (_).", 400);

  const username_: unknown = await userRepository.checkEmailOrUsername(UsernameLowerCase);

  if (username_) return {
    message: "Username already taken.",
    statusCode: 200,
    available: false,
  };

  return {
    message: "Username available.",
    statusCode: 200,
    available: true,
  };

};

export const emailAvailabilityService = async (email?: string): Promise<authAvailabilityType> => {

  if (email === undefined) throw new statusCodeErrors("Incomplete data.", 400);

  if (!emailRegex.test(email)) throw new statusCodeErrors("Invalid email format.", 400);

  const email_: unknown = await userRepository.checkEmailOrUsername(email);

  if (email_) return {
    message: "Email already taken.",
    statusCode: 200,
    available: false,
  };

  return {
    message: "Email available.",
    statusCode: 200,
    available: true,
  };

};