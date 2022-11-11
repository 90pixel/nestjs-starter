import { MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty()
  @MinLength(4, { message: 'Username is too short' })
  username: string;
  @ApiProperty()
  @MinLength(6, { message: 'Password is too short' })
  password: string;
}
