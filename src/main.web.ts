import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { EnvironmentService } from './modules/environment/environment.service';

async function bootstrap() {
  const logger = new Logger("Application");
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const env: EnvironmentService = app.get(EnvironmentService);
  app.enableCors({
    origin: env.ENVIROMENT.CORS_ORIGIN,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      stopAtFirstError: true,
    }),
  );
  app.set('trust proxy', 1);

  await app.listen(env.ENVIROMENT.PORT, () => {
    logger.log(`🚀 Server running on port ${env.ENVIROMENT.PORT}`);
  });
}
bootstrap();
