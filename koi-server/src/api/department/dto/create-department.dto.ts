import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsNotEmpty } from 'class-validator';
import { Department } from '@/api/department/entities/department.entity';

export class CreateDepartmentDto {
  @ApiProperty({
    description: '部门名称',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: '父级id',
  })
  @Allow()
  parentId?: number;
  parent?: Department;
}
