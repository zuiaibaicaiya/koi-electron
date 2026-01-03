import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '@/decorators/isPublic';
import { Department } from '@/api/department/entities/department.entity';
import { ApiSuccessResponse } from '@/decorators/api-success-response/api-success-response.decorator';
import { error, success } from '@/utils/response';

@ApiTags('department')
@Controller('department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @ApiOperation({
    summary: '新增部门',
  })
  @ApiSuccessResponse()
  @Public()
  @Post()
  async create(@Body() createDepartmentDto: CreateDepartmentDto) {
    if (createDepartmentDto.parentId) {
      const parent = await this.departmentService.findOne(
        createDepartmentDto.parentId,
      );
      if (parent) {
        createDepartmentDto.parent = parent;
      }
    }

    const department = await this.departmentService.create(createDepartmentDto);
    if (department) {
      return success();
    }
    return error();
  }

  @ApiOperation({
    summary: '部门树形结构',
  })
  @ApiSuccessResponse(Department)
  @Public()
  @Get()
  async findAll() {
    const res = await this.departmentService.findAll();
    return success(res);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.departmentService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ) {
    return this.departmentService.update(+id, updateDepartmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.departmentService.remove(+id);
  }
}
