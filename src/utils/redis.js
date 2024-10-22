import { resolve } from 'path';
import { config } from 'dotenv';
config({ path: resolve('./config/.env') })
import Redis from 'ioredis';
export const clientRedis = new Redis({
    port: +process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
    // tls: {
    //     rejectUnauthorized: false // Accept self-signed certificates (if needed)
    //   }
});
export const getOrSetCache = async (key, cb) => {
  return new Promise((resolve, reject) => {
       clientRedis.get(key, async (error, data) => {
          if (error) return reject(error);
          if (data != null) return resolve(JSON.parse(data));
          const freshData = await cb();
           clientRedis.set(key, JSON.stringify(freshData));
          resolve(freshData);
      });
  });
}
