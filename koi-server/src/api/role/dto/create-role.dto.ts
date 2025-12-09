import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class CreateRoleDto {
  @ApiProperty({
    description: '角色名称',
  })
  @IsNotEmpty()
  name: string;
}
