import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: '权限名称',
  })
  @Column()
  name: string;
}
