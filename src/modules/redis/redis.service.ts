import { Inject, Injectable } from "@nestjs/common";
import Redis from 'ioredis';
import { REDIS_CLIENT_TOKEN } from "src/shared/constant";

@Injectable()
export class RedisService {
  constructor(@Inject(REDIS_CLIENT_TOKEN) private readonly redisClient: Redis) { }
  
  async setExpire(key: string, value: string, exp: number): Promise<void> {
    await this.redisClient.set(key, value, "EX", exp); // exp in second
  }

  async get(key: string): Promise<string | null> {
    const value = await this.redisClient.get(key);
    return value ?? null;
  }
}