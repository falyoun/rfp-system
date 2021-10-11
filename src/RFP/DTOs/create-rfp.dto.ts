import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRFPDto {
  @IsString()
  @IsNotEmpty()
  description: string;
}
