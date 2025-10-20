import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody, ApiBadRequestResponse } from '@nestjs/swagger';

export function UploadAvatar() {
  return applyDecorators(
    UseInterceptors(FileInterceptor('file')),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    }),
    ApiBadRequestResponse({ description: 'Invalid file or entity not found' }),
  );
}
