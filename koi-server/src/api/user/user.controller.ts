import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { error, paginate, success } from '@/utils/response';
import { RoleService } from '@/api/role/role.service';
import { ApiSuccessResponse } from '@/decorators/api-success-response/api-success-response.decorator';
import * as bcrypt from 'bcryptjs';
import { ApiPaginatedResponse } from '@/decorators/api-paginated-response/api-paginated-response.decorator';
import { User } from '@/api/user/entities/user.entity';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService,
  ) {}

  @ApiOperation({ summary: '新增用户', operationId: 'addUser' })
  @ApiSuccessResponse()
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
    const saltOrRounds = 10;
    createUserDto.password = await bcrypt.hash(
      createUserDto.password,
      saltOrRounds,
    );
    const user = await this.userService.create(createUserDto);
    if (user.id > 0) {
      return success();
    }
    return error();
  }

  @ApiOperation({ summary: '用户列表', operationId: 'getUserList' })
  @ApiPaginatedResponse(User)
  @Get()
  async findAll(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    const [items, total] = await this.userService.findAll(page, pageSize);
    return paginate(items, total, page, pageSize);
  }

  @ApiOperation({
    summary: '用户详情',
    operationId: 'getUser',
  })
  @ApiSuccessResponse(User)
  @ApiParam({
    name: 'id',
    description: '用户id',
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(+id);
    if (!user) {
      return error();
    }
    return success(user);
  }

  @ApiOperation({
    summary: '更新用户',
    operationId: 'updateUser',
  })
  @ApiSuccessResponse()
  @ApiParam({
    name: 'id',
    description: '用户id',
  })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    console.log(updateUserDto);
    const user = await this.userService.findOne(+id);
    if (!user) {
      return error('用户不存在');
    }
    if (updateUserDto.roleId) {
      const role = await this.roleService.findOne(+id);
      if (role) {
        updateUserDto.role = role;
      }
    }
    delete updateUserDto.roleId;
    const { affected } = await this.userService.update(+id, updateUserDto);
    if (affected) {
      return success();
    }
    return error();
  }

  @ApiOperation({
    summary: '删除用户',
    operationId: 'deleteUser',
  })
  @ApiSuccessResponse()
  @ApiParam({
    name: 'id',
    description: '用户id',
  })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const user = await this.userService.findOne(+id);
    if (!user) {
      return error('用户不存在');
    }
    const { affected } = await this.userService.remove(+id);
    if (affected) {
      return success();
    }
    return error();
  }
}
