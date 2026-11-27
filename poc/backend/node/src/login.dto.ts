import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginRequestDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@test.area',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'area2026',
  })
  @IsString()
  password: string;
}
