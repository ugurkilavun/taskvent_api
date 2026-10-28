import { URLToken } from "../../utils/urlTokens.util";

const urlToken = new URLToken();

export const generateTokenAssets = (): { token: string, hashedToken: string, dateNow: Date, date7: Date } => {
  const token: string = urlToken.generate();
  const hashedToken = urlToken.hash(token);
  // Date
  const dateNow: any = new Date();
  const date7: any = new Date();
  date7.setDate(dateNow.getDate() + 7);

  return { token, hashedToken, dateNow, date7 };
};