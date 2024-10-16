// import Redis from 'ioredis';
// export const clientRedis = new Redis({
//   port:6379,
//   host:'127.0.0.1'
// })
// export const getOrSetCache = async (key, cb) => {
//   return new Promise((resolve, reject) => {
//        clientRedis.get(key, async (error, data) => {
//           if (error) return reject(error);
//           if (data != null) return resolve(JSON.parse(data));
//           const freshData = await cb();
//            clientRedis.set(key, JSON.stringify(freshData));
//           resolve(freshData);
//       });
//   });
// }

