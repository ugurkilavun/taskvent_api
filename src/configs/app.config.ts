import dotenv from 'dotenv';

// .env config
dotenv.config({ quiet: true });

interface AppConfig {
  port: string | number;
  url: string;
  nodeEnv: string;
  databaseUrl: string;
};

const appConfig: AppConfig = {
  port: process.env.PORT ?? 5200,
  url: process.env.URL,
  nodeEnv: process.env.NODE_ENV ?? "development",
  databaseUrl: process.env.DATABASE_URL,
};

export default appConfig;