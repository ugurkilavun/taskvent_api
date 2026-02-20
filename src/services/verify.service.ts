// Utils
import { statusCodeErrors } from "../utils/customErrors.util";
import { URLToken } from "../utils/urlTokens.util";
// Repositories
import { VerifyRepository} from "../repositories/verify.repository";
import { UserRepository } from "../repositories/user.repository";
// Types
import { authResponseType } from "../types/responses.type";

// Class
const urlToken = new URLToken();
const userRepository = new UserRepository();
const verifyRepository = new VerifyRepository();

const verifyService = async (token: string): Promise<authResponseType> => {

  if (!token) throw new statusCodeErrors("Token required.", 400);

  const hash_URLToken = urlToken.hash(token);

  const verifyFin = await verifyRepository.findVerify(hash_URLToken);
  if (!verifyFin) throw new statusCodeErrors("Invalid token.", 400);

  if (verifyFin.used) throw new statusCodeErrors("The token has already been used.", 400);
  if (verifyFin.expiresAt < new Date()) throw new statusCodeErrors("The token has expired.", 400);

  const verToken_: boolean = urlToken.verify(hash_URLToken, verifyFin.token);
  if (!verToken_) throw new statusCodeErrors("Invalid or expired token.", 400);

  const updateVerify_: unknown = verifyRepository.updateVerify(verifyFin.id, hash_URLToken);
  if (!updateVerify_) throw new statusCodeErrors("Token error.", 400);

  const upUserVerifiedAccount = userRepository.updateUserVerifiedAccount(verifyFin.id);
  if (!upUserVerifiedAccount) throw new statusCodeErrors("User data could not be updated.", 400);

  return {
    message: "Email verified.",
    HTTPStatusCode: 200
  };

};

export default verifyService;