import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import config from 'config/app';

const queue_config = config.rabbitmq.queue.task;

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        name: queue_config.name.toUpperCase(),
        inject: [ConfigService],
        useFactory: async (cfg: ConfigService) => {
          return {
            transport: Transport.RMQ,
            options: {
              urls: [cfg.get<string>('RABBITMQ_URL')!],
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