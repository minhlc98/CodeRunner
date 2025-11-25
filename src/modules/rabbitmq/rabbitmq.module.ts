import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import config from 'config/app';
import { EnviromentModule } from 'src/modules/enviroment/enviroment.module';
import { EnviromentService } from 'src/modules/enviroment/enviroment.service';

const queue_config = config.rabbitmq.queue.task;

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        imports: [EnviromentModule],
        name: queue_config.name.toUpperCase(),
        inject: [EnviromentService],
        useFactory: async (env: EnviromentService) => {
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