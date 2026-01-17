import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { success } from '@/utils/response';
import { ApiSuccessResponse } from '@/decorators/api-success-response/api-success-response.decorator';
import { Public } from '@/decorators/isPublic';

@ApiTags('app')
@Public()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({
    summary: 'ping',
  })
  @ApiSuccessResponse()
  @Get('/ping')
  ping() {
    return success();
  }
}
