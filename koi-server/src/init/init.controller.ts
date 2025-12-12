import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { InitService } from './init.service';
import { CreateInitDto } from './dto/create-init.dto';
import { UpdateInitDto } from './dto/update-init.dto';
import { ApiTags } from '@nestjs/swagger';
import * as bcrypt from 'bcryptjs';
import { UserService } from '@/api/user/user.service';
import { CreateUserDto } from '@/api/user/dto/create-user.dto';
import { RoleService } from '@/api/role/role.service';

@ApiTags('init')
@Controller('init')
export class InitController {
  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService,
  ) {}
  async init() {
    const role = await this.roleService.findOne(1);
    if (role) {
      return Promise.resolve();
    }
    await this.__initRole();
    await this.__initUser();
  }
  async __initRole() {
    await this.roleService.create({
      name: 'admin',
    });
  }
  async __initUser() {
    const saltOrRounds = 10;
    const user = {
      username: 'admin',
      password: await bcrypt.hash('123456', saltOrRounds),
      roleId: 1,
    } as CreateUserDto;
    return this.userService.create(user);
  }
}
