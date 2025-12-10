import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Role } from '@/api/role/entities/role.entity';
export class CreateUserDto {
  @ApiProperty({
    description: '用户名',
  })
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: '密码',
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: '角色id',
  })
  @IsNotEmpty()
  roleId: number;

  role: Role;
}
