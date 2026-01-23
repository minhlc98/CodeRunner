import { Module } from "@nestjs/common";
import { ProgrammingLanguageController } from "./programming-language.controller";
import { ProgrammingLanguageService } from "./programming-language.service";
import { ProgrammingLanguage } from "./programming-language.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([ProgrammingLanguage])],
  controllers: [ProgrammingLanguageController],
  providers: [ProgrammingLanguageService],
  exports: [ProgrammingLanguageService],
})
export class ProgrammingLanguageModule {}