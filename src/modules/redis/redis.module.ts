import { Global, Logger, Module } from '@nestjs/common';
import { EnviromentService } from 'src/modules/enviroment/enviroment.service';
import Redis from 'ioredis';
import { REDIS_CLIENT_TOKEN } from 'src/shared/constant';
import { RedisService } from './redis.service';

const RedisProvider = {
  provide: REDIS_CLIENT_TOKEN,
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
  providers: [RedisProvider, RedisService],
  exports: [RedisProvider, RedisService],
})
export class RedisModule {}