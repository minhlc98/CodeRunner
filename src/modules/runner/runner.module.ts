import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RabbitMQModule } from 'src/modules/rabbitmq/rabbitmq.module';
import { Runner } from './entities/runner.entity';
import { RunnerService } from './services/runner.service';
import { RunnerController } from './controllers/runner.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Runner]),
    RabbitMQModule
  ],
  controllers: [RunnerController],
  providers: [RunnerService],
})
export class RunnerModule {}