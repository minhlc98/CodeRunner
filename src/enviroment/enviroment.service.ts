import { Injectable } from "@nestjs/common";
import { Expose, plainToInstance, Transform, Type } from "class-transformer";
import { IsBoolean, IsNumber, IsString } from "class-validator";

function stringToBoolean(value: string): boolean {
  return value === 'true' || value === '1';
}

class Enviroment {
  @Expose()
  @IsString()
  TZ: string = "UTC";

  @Expose()
  @IsNumber()
  @Type(() => Number)
  PORT: number = 4000;

  @Expose()
  @IsString()
  CORS_ORIGIN: string = "http://localhost:3000";

  @Expose()
  @IsString()
  RABBITMQ_URL: string = "amqp://guest:guest@localhost:5672";

  @Expose()
  @IsString()
  POSTGRES_HOST: string = "localhost";

  @Expose()
  @IsNumber()
  @Type(() => Number)
  POSTGRES_PORT: number = 5432;

  @Expose()
  @IsString()
  POSTGRES_USER: string = "admin";

  @Expose()
  @IsString()
  POSTGRES_PASSWORD: string = "admin";

  @Expose()
  @IsString()
  POSTGRES_DB: string = "coderunner";

  @Expose()
  @IsBoolean()
  @Transform(({ value }) => stringToBoolean(value))
  POSTGRES_SSL: boolean = false;

  @Expose()
  @IsString()
  REDIS_HOST: string = "localhost";

  @Expose()
  @IsNumber()
  @Type(() => Number)
  REDIS_PORT: number = 6379;

  @Expose()
  @IsString()
  REDIS_USERNAME: string = "default";

  @Expose()
  @IsString()
  REDIS_PASSWORD: string = "default";

  @Expose()
  @IsString()
  JAVASCRIPT: string;

  @Expose()
  @IsString()
  TYPESCRIPT: string;

  @Expose()
  @IsString()
  GO: string;

  @Expose()
  @IsString()
  JAVA: string;

  @Expose()
  @IsString()
  PYTHON: string;
}

@Injectable()
export class EnviromentService {
  public ENVIROMENT: Enviroment;

  constructor() {
    this.ENVIROMENT = plainToInstance(
      Enviroment,
      { ...new Enviroment(), ...process.env },
      { excludeExtraneousValues: true },
    );
  }
}