import { Global, Module } from "@nestjs/common";
import { EnviromentService } from "./enviroment.service";

@Global()
@Module({
  imports: [],
  providers: [EnviromentService],
  exports: [EnviromentService],
})
export class EnviromentModule {}