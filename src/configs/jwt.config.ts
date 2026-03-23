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

const jwtConfig: JwtConfig = {
  // Secrets
  accessSecret: process.env.ACCESS_TOKEN_SECRET,
  refreshSecret: process.env.REFRESH_TOKEN_SECRET,
  // Expires
  accessExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN ?? "15m",
  refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN ?? "365d"
};

export default jwtConfig;