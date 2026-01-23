import { Controller, Get } from "@nestjs/common";
import { ProgrammingLanguageService } from "./programming-language.service";

@Controller("api/programming-languages")
export class ProgrammingLanguageController {
  constructor(private readonly programmingLanguageService: ProgrammingLanguageService) { }
  
  @Get('/list-active')
  findAllActive() {
    return this.programmingLanguageService.findAllActive();
  }
}