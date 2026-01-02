import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiSuccessResponse } from '@/decorators/api-success-response/api-success-response.decorator';
import { error, success } from '@/utils/response';
import { ApiArrayResponse } from '@/decorators/api-array-response/api-array-response.decorator';
import { Permission } from '@/api/permission/entities/permission.entity';

@ApiTags('permission')
@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @ApiOperation({
    summary: '新增权限',
  })
  @ApiSuccessResponse()
  @Post()
  async create(@Body() createPermissionDto: CreatePermissionDto) {
    const permission = await this.permissionService.create(createPermissionDto);
    if (permission.id) {
      return success();
    }
    return error();
  }

  @ApiOperation({
    summary: '权限列表',
  })
  @ApiArrayResponse(Permission)
  @Get()
  async findAll() {
    const permissions = await this.permissionService.findAll();
    return success(permissions);
  }

  @ApiOperation({
    summary: '权限详情',
  })
  @ApiSuccessResponse(Permission)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const permission = await this.permissionService.findOne(+id);
    if (permission) {
      return success(permission);
    }
    return error();
  }

  @ApiOperation({
    summary: '更新权限',
  })
  @ApiSuccessResponse()
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    const { affected } = await this.permissionService.update(
      +id,
      updatePermissionDto,
    );
    if (affected) {
      return success();
    }
    return error();
  }

  @ApiOperation({
    summary: '删除权限',
  })
  @ApiSuccessResponse()
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const { affected } = await this.permissionService.remove(+id);
    if (affected) {
      return success();
    }
    return error();
  }
}
