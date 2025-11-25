import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import Redis from 'ioredis';

import { RunnerModule } from './modules/runner/runner.module';
import { Runner } from './modules/runner/entities/runner.entity';
import { RedisModule } from './modules/redis/redis.module';
import { REDIS_CLIENT } from './modules/redis/redis.module';
import { EnviromentModule } from './modules/enviroment/enviroment.module';
import { EnviromentService } from './modules/enviroment/enviroment.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    EnviromentModule,
    TypeOrmModule.forRootAsync({
      inject: [EnviromentService],
      useFactory: async (env: EnviromentService) => ({
          type: 'postgres',
          host: env.ENVIROMENT.POSTGRES_HOST,
          port: env.ENVIROMENT.POSTGRES_PORT,
          password: env.ENVIROMENT.POSTGRES_PASSWORD,
          username: env.ENVIROMENT.POSTGRES_USER,
          entities: [Runner],
          database: env.ENVIROMENT.POSTGRES_DB || 'coderunner',
          ssl: env.ENVIROMENT.POSTGRES_SSL,
          extra: env.ENVIROMENT.POSTGRES_SSL
            ? {
              ssl: {
                rejectUnauthorized: false,
              },
            }
            : undefined,
          synchronize: false, // NOTE: set to false in production
          logging: false,
      })
    }),
    ThrottlerModule.forRootAsync({
      imports: [RedisModule],
      inject: [REDIS_CLIENT],
      useFactory: (redisClient: Redis) => ({
        throttlers: [{ limit: 10, ttl: 60 }],
        storage: new ThrottlerStorageRedisService(redisClient),
      }),
    }),
    ScheduleModule.forRoot(),
    RunnerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
