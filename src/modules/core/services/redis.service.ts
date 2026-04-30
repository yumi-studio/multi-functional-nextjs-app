import 'server-only';
import Redis from 'ioredis';

const redis = new Redis({
  host: 'localhost',
  port: 6379,
  password: 'redis123'
})

export const cacheWrite = async (key: string, value: any, ttl: number = 0) => {
  await redis.set(key, value);
  if (ttl > 0) {
    await redis.expire(key, ttl);
  }
}

export const cacheRead = async (key: string) => {
  return await redis.get(key)
}

export const cacheReadMultiple = async (keys: string[]) => {
  return await redis.mget(...keys);
}
