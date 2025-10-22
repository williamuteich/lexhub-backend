import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody, ApiBadRequestResponse } from '@nestjs/swagger';

export function UploadFile(additionalFields?: Record<string, any>) {
  const properties: Record<string, any> = {
    file: {
      type: 'string',
      format: 'binary',
      description: 'File to upload',
    },
  };

  if (additionalFields) {
    Object.assign(properties, additionalFields);
  }

  return applyDecorators(
    UseInterceptors(FileInterceptor('file')),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        required: ['file'],
        properties,
      },
    }),
    ApiBadRequestResponse({ description: 'Invalid file' }),
  );
}

export const UploadAvatar = UploadFile;
