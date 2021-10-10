import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './DTOs/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createOne(createUserDto: CreateUserDto) {
    const createdUser = await this.userRepository.create(createUserDto);
    await this.userRepository.save(createdUser);
    return createdUser;
  }
}
