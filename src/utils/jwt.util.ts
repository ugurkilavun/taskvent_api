import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
// Types
import { payloadType } from "../types/jwt.type";

// .env config
dotenv.config({ quiet: true })

export const signToken = (payload: payloadType, secretType: string, expiresIn: any): string => {
  // secret type(s): refresh | access
  // * Varibles
  const header: any = { alg: "HS256", typ: "JWT" };
  const secret: string = secretType === "access" ? process.env.ACCESS_SECRET : process.env.REFRESH_SECRET;
  return jwt.sign(payload, secret, { header: header, expiresIn: expiresIn });
};