import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import Redis from 'ioredis';

import { RunnerModule } from './modules/runner/runner.module';
import { Runner } from './modules/runner/entities/runner.entity';
import { RedisModule } from './shared/redis.module';
import { REDIS_CLIENT } from './shared/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: process.env.POSTGRES_PORT
        ? parseInt(process.env.POSTGRES_PORT)
        : 5432,
      password: process.env.POSTGRES_PASSWORD,
      username: process.env.POSTGRES_USER,
      entities: [Runner],
      database: process.env.POSTGRES_DB || 'coderunner',
      ssl: process.env.POSTGRES_SSL === 'true' ? true : false,
      extra: process.env.POSTGRES_SSL === 'true'
        ? {
            ssl: {
              rejectUnauthorized: false,
            },
          }
        : undefined,
      synchronize: true, // NOTE: set to false in production
      logging: false,
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
