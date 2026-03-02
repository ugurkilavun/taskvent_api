import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
// Types
import { payloadType } from "../types/jwt.type";

// .env config
dotenv.config({ quiet: true })

export const signToken = (payload: payloadType, secretType: "refresh" | "access"): string => {
  // * Varibles
  const header: any = { alg: "HS256", typ: "JWT" };
  const secret: string = secretType === "access" ? process.env.ACCESS_TOKEN_SECRET : process.env.REFRESH_TOKEN_SECRET;
  const expiresIn: any = secretType === "access" ? process.env.ACCESS_TOKEN_EXPIRES_IN : process.env.REFRESH_TOKEN_EXPIRES_IN;

  return jwt.sign(payload, secret, { header: header, expiresIn: expiresIn });
};