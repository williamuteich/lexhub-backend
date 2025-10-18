export const FILE_UPLOAD_CONSTRAINTS = {
  ALLOWED_IMAGE_MIME_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'] as string[],
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB in bytes
  DEFAULT_FOLDER: 'avatars',
};

export const FILE_UPLOAD_MESSAGES = {
  NO_FILE: 'No file provided',
  INVALID_TYPE: 'Invalid file type. Only JPEG, PNG and WebP are allowed',
  FILE_TOO_LARGE: 'File too large. Maximum size is 5MB',
} as const;
