import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RunnerModule } from './modules/runner/runner.module';
import { Runner } from './modules/runner/entities/runner.entity';
import { ScheduleModule } from '@nestjs/schedule';

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
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
      synchronize: true, // NOTE: set to false in production
      logging: false,
    }),
    ScheduleModule.forRoot(),
    RunnerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
