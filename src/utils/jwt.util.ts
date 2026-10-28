import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
// Configs
import jwtConfig from "../configs/jwt.config";
// Types
import { payloadType } from "../types/jwt.type";

export const signToken = (payload: payloadType, secretType: "refresh" | "access"): string => {
  // * Varibles
  const header: any = { alg: "HS256", typ: "JWT" };
  const secret: string = secretType === "access" ? jwtConfig.accessSecret : jwtConfig.refreshSecret;
  const expiresIn: any = secretType === "access" ? jwtConfig.accessExpiresIn : jwtConfig.refreshExpiresIn;

  return jwt.sign(payload, secret, { header: header, expiresIn: expiresIn });
};