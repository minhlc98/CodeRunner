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
import { EnviromentModule } from './modules/environment/environment.module';
import { EnvironmentService } from './modules/environment/environment.service';
import { CronModule } from './modules/cron/cron.module';
import { ProgrammingLanguageModule } from './modules/programming-language/programming-language.module';
import { ProgrammingLanguage } from './modules/programming-language/programming-language.entity';
import { REDIS_CLIENT_TOKEN } from './shared/constant';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.local',
    }),
    EnviromentModule,
    TypeOrmModule.forRootAsync({
      inject: [EnvironmentService],
      useFactory: async (env: EnvironmentService) => ({
          type: 'postgres',
          host: env.ENVIROMENT.POSTGRES_HOST,
          port: env.ENVIROMENT.POSTGRES_PORT,
          password: env.ENVIROMENT.POSTGRES_PASSWORD,
          username: env.ENVIROMENT.POSTGRES_USER,
          entities: [ProgrammingLanguage, Runner],
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
    RedisModule,
    ThrottlerModule.forRootAsync({
      imports: [RedisModule],
      inject: [REDIS_CLIENT_TOKEN],
      useFactory: (redisClient: Redis) => ({
        throttlers: [{ limit: 10, ttl: 60 }],
        storage: new ThrottlerStorageRedisService(redisClient),
      }),
    }),
    ScheduleModule.forRoot(),
    CronModule,
    ProgrammingLanguageModule,
    RunnerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
