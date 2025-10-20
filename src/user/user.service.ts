import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role } from '@prisma/client';
import { UserDto } from './dto/userDto';
import { CreateUserDto } from './dto/user-create-dto';
import { HashingServiceProtocol } from 'src/auth/hashingPassword/hashing.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PayloadTokenDto } from 'src/auth/config/payload-token-dto';
import { UpdateUserDto } from './dto/user-update-dto';
import { StorageService } from 'src/storage/storage.service';

@Injectable()
export class UserService {
  private readonly userSelect = {
    id: true,
    name: true,
    email: true,
    avatar: true,
    status: true,
    role: true,
    createdAt: true,
    updatedAt: true,
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly hashingService: HashingServiceProtocol,
    private readonly storageService: StorageService,
  ) {}

  async findAll(paginationDto: PaginationDto): Promise<UserDto[]> {
    const { limit, offset } = paginationDto;
    try {
      return await this.prisma.user.findMany({
        select: this.userSelect,
        take: limit,
        skip: offset,
      });
    } catch (error) {
      console.error(error);
      throw new HttpException('Failed to fetch users', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: string, payloadTokenDto: PayloadTokenDto): Promise<UserDto> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        select: this.userSelect,
      });

      if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

      if (payloadTokenDto.role !== Role.ADMIN && payloadTokenDto.sub !== id) {
        throw new HttpException('You can only view your own profile', HttpStatus.FORBIDDEN);
      }

      return user;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Failed to fetch user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    try {
      const { name, email, password, avatar, role } = createUserDto;

      const userExist = await this.prisma.user.findUnique({ where: { email } });
      if (userExist) throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);

      const hashedPassword = await this.hashingService.hash(password);

      return await this.prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          avatar,
          role: role || 'COLLABORATOR',
        },
        select: this.userSelect,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Failed to create user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto, payloadTokenDto: PayloadTokenDto): Promise<UserDto> {
    try {
      const isAdmin = payloadTokenDto.role === Role.ADMIN;

      if (!isAdmin && payloadTokenDto.sub !== id) {
        throw new HttpException('You can only update your own profile', HttpStatus.FORBIDDEN);
      }

      if (updateUserDto.email) {
        const emailTaken = await this.prisma.user.findUnique({
          where: { email: updateUserDto.email },
        });

        if (emailTaken && emailTaken.id !== id) {
          throw new HttpException('Email is already in use by another account', HttpStatus.BAD_REQUEST);
        }
      }

      if (!isAdmin && updateUserDto.role) {
        throw new HttpException('Only admins can change user roles', HttpStatus.FORBIDDEN);
      }

      const updatedData = { ...updateUserDto };
      if (updatedData.password) {
        updatedData.password = await this.hashingService.hash(updatedData.password);
      }

      return await this.prisma.user.update({
        where: { id },
        data: updatedData,
        select: this.userSelect,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw new HttpException('Failed to update user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateAvatar(id: string, file: Express.Multer.File, payloadTokenDto: PayloadTokenDto): Promise<UserDto> {
    try {
      if (payloadTokenDto.role !== Role.ADMIN && payloadTokenDto.sub !== id) {
        throw new HttpException('You can only update your own avatar', HttpStatus.FORBIDDEN);
      }

      const existingUser = await this.prisma.user.findUnique({ where: { id } });
      if (!existingUser) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

      if (existingUser.avatar) {
        const oldKey = this.storageService.extractKeyFromUrl(existingUser.avatar);
        if (oldKey) await this.storageService.deleteFile(oldKey);
      }

      const uploadResult = await this.storageService.uploadFile(file, 'avatars');

      return await this.prisma.user.update({
        where: { id },
        data: { avatar: uploadResult.url },
        select: this.userSelect,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw new HttpException('Failed to update avatar', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async delete(id: string, payloadTokenDto: PayloadTokenDto): Promise<{ message: string }> {
    try {
      if (payloadTokenDto.role !== Role.ADMIN && payloadTokenDto.sub !== id) {
        throw new HttpException('You can only delete your own account', HttpStatus.FORBIDDEN);
      }

      await this.prisma.user.delete({ where: { id } });

      return { message: 'User deleted successfully' };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Failed to delete user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
