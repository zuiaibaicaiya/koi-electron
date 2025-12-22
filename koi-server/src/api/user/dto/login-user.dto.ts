import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class LoginUserDto {
  @ApiProperty({
    description: '用户名',
    example: 'koi-electron',
  })
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: '密码',
    example: '123456',
  })
  @IsNotEmpty()
  password: string;
}
