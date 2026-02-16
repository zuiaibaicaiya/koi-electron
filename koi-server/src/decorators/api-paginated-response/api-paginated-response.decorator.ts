import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, getSchemaPath, ApiOkResponse, ApiQuery } from '@nestjs/swagger';

export const ApiPaginatedResponse = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiExtraModels(model),
    ApiQuery({
      name: 'page',
      default: 1,
      minimum: 1,
      required: false,
      description: '页码',
    }),
    ApiQuery({
      name: 'pageSize',
      default: 16,
      minimum: 1,
      required: false,
      description: '每页数量',
    }),
    ApiOkResponse({
      schema: {
        properties: {
          status: {
            type: 'number',
            description: '状态码',
          },
          msg: {
            type: 'string',
            description: '提示消息',
          },
          data: {
            type: 'object',
            allOf: [
              {
                properties: {
                  total: {
                    type: 'number',
                    description: '总数',
                  },
                  pageSize: {
                    type: 'number',
                    description: '每页数量',
                    example: 16,
                  },
                  page: {
                    type: 'number',
                    description: '页码',
                    example: 1,
                  },
                  items: {
                    type: 'array',
                    items: { $ref: getSchemaPath(model) },
                  },
                },
              },
            ],
          },
        },
      },
    }),
  );
};
