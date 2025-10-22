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
import { EntityExistsValidator } from 'src/common/validators/entity-exists.validator';
import { MESSAGES } from 'src/common/constants/messages.constant';

@Injectable()
export class UserService {
  private readonly userSelectBasic = {
    id: true,
    name: true,
    email: true,
    avatar: true,
    status: true,
    role: true,
    createdAt: true,
    updatedAt: true,
  };

  private readonly userSelectFull = {
    id: true,
    name: true,
    email: true,
    avatar: true,
    status: true,
    role: true,
    processos: {
      select: {
        id: true,
        numeroProcesso: true,
        tipo: true,
        status: true,
        dataAbertura: true,
      }
    },
    createdAt: true,
    updatedAt: true,
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly hashingService: HashingServiceProtocol,
    private readonly storageService: StorageService,
    private readonly validator: EntityExistsValidator,
  ) {}

  async findAll(paginationDto: PaginationDto): Promise<UserDto[]> {
    const { limit, offset } = paginationDto;
    return await this.prisma.user.findMany({
      select: this.userSelectBasic,
      take: limit,
      skip: offset,
    });
  }

  async findOne(id: string, payloadTokenDto: PayloadTokenDto): Promise<UserDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: this.userSelectFull,
    });

    if (!user) throw new HttpException(MESSAGES.NOT_FOUND.USER, HttpStatus.NOT_FOUND);

    if (payloadTokenDto.role !== Role.ADMIN && payloadTokenDto.sub !== id) {
      throw new HttpException(MESSAGES.FORBIDDEN.VIEW_OWN_PROFILE, HttpStatus.FORBIDDEN);
    }

    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<{ message: string; user: UserDto }> {
    const { name, email, password, avatar, role } = createUserDto;

    await this.validator.validateEmailNotInUse(email, 'user');

    const hashedPassword = await this.hashingService.hash(password);

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        avatar,
        role: role || 'COLLABORATOR',
      },
      select: this.userSelectBasic,
    });

    return { message: MESSAGES.SUCCESS.CREATED('User'), user };
  }

  async update(id: string, updateUserDto: UpdateUserDto, payloadTokenDto: PayloadTokenDto): Promise<{ message: string; user: UserDto }> {
    const isAdmin = payloadTokenDto.role === Role.ADMIN;

    if (!isAdmin && payloadTokenDto.sub !== id) {
      throw new HttpException(MESSAGES.FORBIDDEN.UPDATE_OWN_PROFILE, HttpStatus.FORBIDDEN);
    }

    if (updateUserDto.email) {
      const emailTaken = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });

      if (emailTaken && emailTaken.id !== id) {
        throw new HttpException('Email is already in use by another account', HttpStatus.CONFLICT);
      }
    }

    if (!isAdmin && updateUserDto.role) {
      throw new HttpException('Only admins can change user roles', HttpStatus.FORBIDDEN);
    }

    const updatedData = { ...updateUserDto };
    if (updatedData.password) {
      updatedData.password = await this.hashingService.hash(updatedData.password);
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: updatedData,
      select: this.userSelectBasic,
    });

    return { message: MESSAGES.SUCCESS.UPDATED('User'), user };
  }

  async updateAvatar(id: string, file: Express.Multer.File, payloadTokenDto: PayloadTokenDto): Promise<{ message: string; user: UserDto }> {
    if (payloadTokenDto.role !== Role.ADMIN && payloadTokenDto.sub !== id) {
      throw new HttpException('You can only update your own avatar', HttpStatus.FORBIDDEN);
    }

    await this.validator.validateUserExists(id);
    const existingUser = await this.prisma.user.findUnique({ where: { id } });

    try {
      if (existingUser?.avatar) {
        const oldKey = this.storageService.extractKeyFromUrl(existingUser.avatar);
        if (oldKey) await this.storageService.deleteFile(oldKey);
      }
    } catch (error) {
      console.warn('Failed to delete old avatar:', error);
    }

    const uploadResult = await this.storageService.uploadFile(file, 'avatars');

    const user = await this.prisma.user.update({
      where: { id },
      data: { avatar: uploadResult.url },
      select: this.userSelectBasic,
    });

    return { message: MESSAGES.SUCCESS.UPDATED('Avatar'), user };
  }

  async delete(id: string, payloadTokenDto: PayloadTokenDto): Promise<{ message: string }> {
    if (payloadTokenDto.role !== Role.ADMIN && payloadTokenDto.sub !== id) {
      throw new HttpException('You can only delete your own account', HttpStatus.FORBIDDEN);
    }

    await this.validator.validateUserExists(id);

    await this.prisma.user.delete({ where: { id } });

    return { message: MESSAGES.SUCCESS.DELETED('User') };
  }
}
