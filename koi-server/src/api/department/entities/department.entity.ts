import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import type { Relation } from 'typeorm';

@Entity()
@Tree('closure-table')
export class Department {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: '部门名称',
  })
  @Column()
  name: string;

  @ApiProperty({
    description: '子集节点',
    type: () => [Department],
  })
  @TreeChildren()
  children: Relation<Department>[];

  @ApiProperty({
    description: '父级节点',
    type: () => Department,
  })
  @TreeParent()
  parent: Relation<Department>;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @DeleteDateColumn()
  deletedAt: Date;
}
