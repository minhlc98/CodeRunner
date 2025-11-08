import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export const REDIS_CLIENT = Symbol('REDIS_CLIENT');

const redisProvider = {
  provide: REDIS_CLIENT,
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    const client = new Redis({
      host: configService.get<string>('REDIS_HOST'),
      port: configService.get<number>('REDIS_PORT'),
      username: configService.get<string>('REDIS_USERNAME'),
      password: configService.get<string>('REDIS_PASSWORD'),
      lazyConnect: true,
    });

    client.on('ready', () => console.log('Redis connected ✅'));
    client.on('error', (err) => console.error('Redis error ❌', err));

    await client.connect();
    return client;
  },
};

@Global()
@Module({
  imports: [ConfigModule],
  providers: [redisProvider],
  exports: [redisProvider],
})
export class RedisModule {}