import { Global, Module } from "@nestjs/common";
import { EnvironmentService } from "./environment.service";

@Global()
@Module({
  imports: [],
  providers: [EnvironmentService],
  exports: [EnvironmentService],
})
export class EnviromentModule {}