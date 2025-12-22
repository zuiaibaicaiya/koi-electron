import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ApiPaginatedResponse } from '@/decorators/api-paginated-response/api-paginated-response.decorator';
import { Role } from '@/api/role/entities/role.entity';
import { error, paginate, success } from '@/utils/response';
import { ApiSuccessResponse } from '@/decorators/api-success-response/api-success-response.decorator';

@ApiTags('role')
@ApiBearerAuth()
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiOperation({ summary: '新增角色', operationId: 'addRole' })
  @ApiSuccessResponse()
  @Post()
  async create(@Body() createRoleDto: CreateRoleDto) {
    const result = await this.roleService.create(createRoleDto);
    if (result.identifiers.length > 0) {
      return success();
    }
    return error();
  }

  @ApiOperation({ summary: '角色列表', operationId: 'createRole' })
  @ApiPaginatedResponse(Role)
  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(16), ParseIntPipe) pageSize: number,
  ) {
    const [items, total] = await this.roleService.findAll(page, pageSize);
    return paginate(items, total, page, pageSize);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(+id);
  }

  @ApiOperation({ summary: '更新角色', operationId: 'updateRole' })
  @ApiParam({
    name: 'id',
    description: '角色id',
    type: 'number',
  })
  @ApiSuccessResponse()
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    const role = await this.roleService.findOne(+id);
    if (!role) {
      return error('角色不存在');
    }
    const { affected } = await this.roleService.update(+id, updateRoleDto);
    if (affected) {
      return success();
    }
    return error();
  }

  @ApiOperation({ summary: '删除角色', operationId: 'deleteRole' })
  @ApiParam({
    name: 'id',
    description: '角色id',
    type: 'number',
  })
  @ApiSuccessResponse()
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const role = await this.roleService.findOne(+id);
    if (!role) {
      return error('角色不存在');
    }
    const { affected } = await this.roleService.remove(+id);
    if (affected) {
      return success();
    }
    return error();
  }
}
