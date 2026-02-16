import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, getSchemaPath, ApiProperty, ApiOkResponse } from '@nestjs/swagger';

export class SuccessDto {
  @ApiProperty({
    description: '状态码',
  })
  status: number;

  @ApiProperty({
    description: '消息提示',
  })
  msg: string;
}

export const ApiSuccessResponse = <TModel extends Type<any>>(model?: TModel) => {
  if (model) {
    return applyDecorators(
      ApiExtraModels(SuccessDto, model),
      ApiOkResponse({
        schema: {
          allOf: [
            { $ref: getSchemaPath(SuccessDto) },
            {
              properties: {
                data: { $ref: getSchemaPath(model) },
              },
            },
          ],
        },
      }),
    );
  } else {
    return applyDecorators(
      ApiExtraModels(SuccessDto),
      ApiOkResponse({
        schema: {
          allOf: [
            { $ref: getSchemaPath(SuccessDto) },
            {
              properties: {
                data: {
                  type: 'object',
                },
              },
            },
          ],
        },
      }),
    );
  }
};
