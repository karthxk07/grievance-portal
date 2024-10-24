import { createClient } from "redis";
import { config } from "dotenv";
config();

const options = {
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
  password: process.env.REDIS_PASSWORD,
};

export const redisClient = createClient(options);
