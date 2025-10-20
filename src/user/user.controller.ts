import { Controller, Get, Post, Body, Param, Delete, Query, UseGuards, Patch, UploadedFile, UseInterceptors, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiCreatedResponse, ApiBadRequestResponse, ApiNotFoundResponse, ApiParam, ApiBody, ApiQuery, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Role } from '@prisma/client';
import { UserService } from './user.service';
import { UserDto } from './dto/userDto';
import { CreateUserDto } from './dto/user-create-dto';
import { LongThrottle } from 'src/common/throttle/throttle.decorators';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { TokenPayload } from 'src/auth/decorator/token-payload.decorator';
import { AuthTokenGuard } from 'src/auth/guard/auth-token.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { PayloadTokenDto } from 'src/auth/config/payload-token-dto';
import { UpdateUserDto } from './dto/user-update-dto';
import { FILE_UPLOAD_CONSTRAINTS, FILE_UPLOAD_MESSAGES } from 'src/storage/constants/file-upload.constants';


@Controller('users')
@ApiTags('users')
@LongThrottle()
@UseGuards(AuthTokenGuard, RolesGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  @Roles(Role.ADMIN)
  @ApiQuery({ name: 'limit', required: false, example: 10, description: 'Limit of users to return' })
  @ApiQuery({ name: 'offset', required: false, example: 0, description: 'Offset of users to return' })
  @ApiOperation({ summary: 'Get all users', description: 'Returns all registered users' })
  @ApiOkResponse({ description: 'List of users', type: UserDto, isArray: true })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.userService.findAll(paginationDto);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.COLLABORATOR)
  @ApiOperation({ summary: 'Get one user', description: 'Finds a user by ID' })
  @ApiParam({ name: 'id', type: String, description: 'User ID', example: '68f01cf97f0e9eb12f558567' })
  @ApiOkResponse({ description: 'User found', type: UserDto })
  @ApiNotFoundResponse({ description: 'User not found' })
  findOne(@Param('id') id: string, @TokenPayload() payloadTokenDto: PayloadTokenDto) {
    return this.userService.findOne(id, payloadTokenDto);
  }

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a new user', description: 'Creates a new user with the provided data' })
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse({ description: 'User successfully created', type: UserDto })
  @ApiBadRequestResponse({ description: 'Invalid data provided' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.COLLABORATOR)
  @ApiOperation({ summary: 'Update a user', description: 'Updates a user by ID' })
  @ApiParam({ name: 'id', type: String, description: 'User ID', example: '68f01cf97f0e9eb12f558567' })
  @ApiBody({ type: UpdateUserDto })
  @ApiOkResponse({ description: 'User successfully updated', type: UserDto })
  @ApiNotFoundResponse({ description: 'User not found' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @TokenPayload() tokenPayload: PayloadTokenDto) {
    return this.userService.update(id, updateUserDto, tokenPayload);
  }

  @Patch(':id/avatar')
  @Roles(Role.ADMIN, Role.COLLABORATOR)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload user avatar', description: 'Upload avatar image to R2 and update user profile' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', type: String, description: 'User ID', example: '68f01cf97f0e9eb12f558567' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOkResponse({ description: 'Avatar successfully updated', type: UserDto })
  @ApiBadRequestResponse({ description: 'Invalid file or user not found' })
  async uploadAvatar(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @TokenPayload() tokenPayload: PayloadTokenDto,
  ) {
    if (!file) {
      throw new HttpException(FILE_UPLOAD_MESSAGES.NO_FILE, HttpStatus.BAD_REQUEST);
    }

    if (!FILE_UPLOAD_CONSTRAINTS.ALLOWED_IMAGE_MIME_TYPES.includes(file.mimetype)) {
      throw new HttpException(FILE_UPLOAD_MESSAGES.INVALID_TYPE, HttpStatus.BAD_REQUEST);
    }

    if (file.size > FILE_UPLOAD_CONSTRAINTS.MAX_FILE_SIZE) {
      throw new HttpException(FILE_UPLOAD_MESSAGES.FILE_TOO_LARGE, HttpStatus.BAD_REQUEST);
    }

    return this.userService.updateAvatar(id, file, tokenPayload);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.COLLABORATOR)
  @ApiOperation({ summary: 'Delete a user', description: 'Deletes a user by ID (ADMIN only)' })
  @ApiParam({ name: 'id', type: String, description: 'User ID', example: '68f01cf97f0e9eb12f558567' })
  @ApiOkResponse({ description: 'User successfully deleted' })
  @ApiNotFoundResponse({ description: 'User not found' })
  delete(@Param('id') id: string, @TokenPayload() tokenPayload: PayloadTokenDto) {
    return this.userService.delete(id, tokenPayload);
  }
}
