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

@ApiTags('init')
@Controller('init')
export class InitController {
  constructor(private readonly initService: InitService) {}

  @Post()
  create(@Body() createInitDto: CreateInitDto) {
    return this.initService.create(createInitDto);
  }

  @Get()
  findAll() {
    return this.initService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.initService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInitDto: UpdateInitDto) {
    return this.initService.update(+id, updateInitDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.initService.remove(+id);
  }
}
