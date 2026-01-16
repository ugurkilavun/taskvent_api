// Utils
import { statusCodeErrors } from "../utils/customErrors.util";
import { verifyURLToken, hashURLToken } from "../utils/urlTokens.util";
// Repositories
import { updateVerify, findVerify } from "../repositories/verify.repository";
// Types
import { authResponseType } from "../types/responses.type";

const verifyService = async (token: string): Promise<authResponseType> => {

  if (!token) throw new statusCodeErrors("Token required.", 400);

  const hash_URLToken = hashURLToken(token);

  const verifyFin = await findVerify(hash_URLToken);
  if (!verifyFin) throw new statusCodeErrors("Invalid token.", 400);

  if (verifyFin.used) throw new statusCodeErrors("The token has already been used.", 400);
  if (verifyFin.expiresAt < new Date()) throw new statusCodeErrors("The token has expired.", 400);

  const verToken_: boolean = verifyURLToken(hash_URLToken, verifyFin.token);
  if (!verToken_) throw new statusCodeErrors("Invalid or expired token.", 400);

  const updateVerify_: unknown = updateVerify(verifyFin.id, hash_URLToken);
  if (!updateVerify_) throw new statusCodeErrors("Token error.", 400);

  return {
    message: "Email verified.",
    HTTPStatusCode: 200
  };

};

export default verifyService;