import type { Relation } from 'typeorm';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Permission } from '@/api/permission/entities/permission.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: '角色名称',
  })
  @Column()
  name: string;

  @ApiProperty({
    description: '角色权限',
    isArray: true,
    type: () => Permission,
  })
  @ManyToMany(() => Permission, { createForeignKeyConstraints: false })
  @JoinTable()
  permissions: Relation<Permission>[];
}
