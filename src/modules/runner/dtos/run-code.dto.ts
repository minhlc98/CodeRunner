import { IsString, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class RunCodeDto {
  @IsString()
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty({ message: 'Language is required' })
  programmingLanguageId: string;

  @IsString()
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty({ message: 'Code is required' })
  code: string;
}
