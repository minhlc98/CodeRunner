import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RabbitMQModule } from 'src/modules/rabbitmq/rabbitmq.module';
import { Runner } from './entities/runner.entity';
import { RunnerService } from './services/runner.service';
import { RunnerController } from './controllers/runner.controller';
import { ProgrammingLanguageModule } from '../programming-language/programming-language.module';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [
    ProgrammingLanguageModule,
    TypeOrmModule.forFeature([Runner]),
    RabbitMQModule,
    RedisModule,
  ],
  controllers: [RunnerController],
  providers: [RunnerService],
  exports: [RunnerService]
})
export class RunnerModule {}