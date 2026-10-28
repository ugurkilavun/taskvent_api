import { createClient, type RedisClientType } from "redis";

let client: RedisClientType | null = null;

const connectRedis = async (): Promise<RedisClientType> => {

  if (!client) {
    client = createClient();

    client.on("error", (error) => {
      console.log(`\x1b[31m[DEBUG] Redis Not Connected!\x1b[0m`, error)
    });

    client.on("connect", () => {
      console.log(`\x1b[32m[DEBUG] Redis Connected!\x1b[0m`)
    });

    await client.connect();
  };

  return client;
};

export default connectRedis;