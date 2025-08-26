import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Runner } from './entities/runner.entity';
import { RunnerService } from './runner.service';
import { RunnerController } from './runner.controller';
import { RabbitMQModule } from 'src/shared/rmq.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Runner]),
    RabbitMQModule
  ],
  controllers: [RunnerController],
  providers: [RunnerService],
})
export class RunnerModule {}