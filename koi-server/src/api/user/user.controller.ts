import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { error, success } from '@/utils/response';
import { RoleService } from '@/api/role/role.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    if (createUserDto.roleId) {
      const role = await this.roleService.findOne(createUserDto.roleId);
      if (role) {
        createUserDto.role = role;
      } else {
        return error('角色不存在');
      }
    }
    const user = await this.userService.create(createUserDto);
    if (user.id > 0) {
      return success();
    }
    return error();
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
