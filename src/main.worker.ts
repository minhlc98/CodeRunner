import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import config from 'config/app';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL!],
      queue: config.rabbitmq.queue.task.name,
      queueOptions: {
        durable: true
      },
      prefetchCount: config.rabbitmq.queue.task.prefetch,
      persistent: true,
      noAck: false,
    }
  });

  await app.listen();
  console.log(`Microservice is listening on ${process.env.RABBITMQ_URL}`);
}

bootstrap();