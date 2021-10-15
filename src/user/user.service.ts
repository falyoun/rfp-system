import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './DTOs/create-user.dto';
import { AppFileService } from '../../shared/file-upload/src';
import { UserErrors } from '@app/errors';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private appFileService: AppFileService,
  ) {}

  async createOne(createUserDto: CreateUserDto) {
    const createdUser = await this.userRepository.create(createUserDto);
    const savedUser = await this.userRepository.save(createdUser);
    console.log(savedUser);
    return savedUser;
  }

  async addAvatar(userId: number, imageBuffer: Buffer, filename: string) {
    const avatar = await this.appFileService.uploadPublicFile(
      imageBuffer,
      filename,
    );
    const user = await this.findOne({
      where: { id: userId },
    });
    await this.userRepository.update(userId, {
      ...user,
      avatar,
    });
    return avatar;
  }

  findOne(findOneOptions: FindOneOptions<UserEntity>) {
    return this.userRepository.findOne(findOneOptions).then((user) => {
      if (!user) {
        throw new HttpException(
          UserErrors.WRONG_CREDENTIALS,
          HttpStatus.NOT_FOUND,
        );
      }
      return user;
    });
  }
  findMany(findOptions: FindManyOptions<UserEntity>) {
    return this.userRepository.find(findOptions);
  }
}
