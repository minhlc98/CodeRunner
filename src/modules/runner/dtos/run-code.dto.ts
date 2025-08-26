import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import _CONST from 'src/shared/_CONST';

export class RunCodeDto {
  @IsString()
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty({ message: 'Language is required' })
  @IsEnum(_CONST.RUNNER.LIST_LANGUAGE, {
    message: `Language must be one of the following values: ${_CONST.RUNNER.LIST_LANGUAGE.join(', ')}`,
  })
  language: string;

  @IsString()
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty({ message: 'Code is required' })
  code: string;
}
