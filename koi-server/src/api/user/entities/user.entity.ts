import type { Relation } from 'typeorm';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '@/api/role/entities/role.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: '用户名',
  })
  @Column()
  username: string;

  @ApiProperty({
    description: '密码',
  })
  @Column({ select: false })
  password: string;

  @ApiProperty({
    description: '状态：0禁用；1激活',
  })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({
    description: '用户所属的角色',
    type: () => Role,
  })
  @OneToOne(() => Role, { createForeignKeyConstraints: false })
  @JoinColumn()
  role: Relation<Role>;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @DeleteDateColumn()
  deletedAt: Date;
}
