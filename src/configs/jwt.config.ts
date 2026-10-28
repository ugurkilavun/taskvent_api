import dotenv from 'dotenv';

// .env config
dotenv.config({ quiet: true });

interface JwtConfig {
  // Secrets
  accessSecret: string;
  refreshSecret: string;
  // Expires
  accessExpiresIn: string;
  refreshExpiresIn: string;
};

// type-safe
if (!process.env.ACCESS_TOKEN_SECRET) {
  throw new Error("ACCESS_TOKEN_SECRET is not defined in .env");
};

if (!process.env.REFRESH_TOKEN_SECRET) {
  throw new Error("REFRESH_TOKEN_SECRET is not defined in .env");
};

const jwtConfig: JwtConfig = {
  // Secrets
  accessSecret: process.env.ACCESS_TOKEN_SECRET,
  refreshSecret: process.env.REFRESH_TOKEN_SECRET,
  // Expires
  accessExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN ?? "15m",
  refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN ?? "365d"
};

export default jwtConfig;