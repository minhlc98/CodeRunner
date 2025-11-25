import { Global, Logger, Module } from '@nestjs/common';
import { EnviromentService } from 'src/modules/enviroment/enviroment.service';
import Redis from 'ioredis';

export const REDIS_CLIENT = Symbol('REDIS_CLIENT');

const redisProvider = {
  provide: REDIS_CLIENT,
  inject: [EnviromentService],
  useFactory: async (env: EnviromentService) => {
    const client = new Redis({
      host: env.ENVIROMENT.REDIS_HOST,
      port: env.ENVIROMENT.REDIS_PORT,
      username: env.ENVIROMENT.REDIS_USERNAME,
      password: env.ENVIROMENT.REDIS_PASSWORD,
      lazyConnect: true,
    });

    const logger = new Logger("Redis");

    client.on('ready', () => logger.log('connected ✅'));
    client.on('error', (err) => logger.error('error ❌', err));

    await client.connect();
    return client;
  },
};

@Global()
@Module({
  providers: [redisProvider],
  exports: [redisProvider],
})
export class RedisModule {}