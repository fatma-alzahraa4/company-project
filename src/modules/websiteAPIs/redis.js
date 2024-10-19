import Redis from 'ioredis';
export const clientRedis = new Redis({
    port: 14599,
    host: 'redis-14599.c328.europe-west3-1.gce.redns.redis-cloud.com',
    password: 'kyWXJ3zpRXB4Z8LJza9gpvTk3KT3bK7D',
    // tls: {
    //     rejectUnauthorized: false // Accept self-signed certificates (if needed)
    //   }
})
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

