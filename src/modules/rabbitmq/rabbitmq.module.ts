import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import config from 'config/app';
import { EnviromentModule } from 'src/modules/environment/environment.module';
import { EnvironmentService } from 'src/modules/environment/environment.service';

const queue_config = config.rabbitmq.queue.task;

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        imports: [EnviromentModule],
        name: queue_config.name.toUpperCase(),
        inject: [EnvironmentService],
        useFactory: async (env: EnvironmentService) => {
          return {
            transport: Transport.RMQ,
            options: {
              urls: [env.ENVIROMENT.RABBITMQ_URL],
              queue: queue_config.name,
              queueOptions: { durable: queue_config.durable },
              prefetchCount: queue_config.prefetch,
              persistent: queue_config.persistent,
            }
          }
        },
      }
    ]),
  ],
  exports: [ClientsModule],
})
export class RabbitMQModule {}