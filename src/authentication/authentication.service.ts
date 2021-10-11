import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { RegistrationDto } from './DTOs/registration.dto';
import * as bcrypt from 'bcrypt';
import { GlobalErrors, PostgresErrorCode, UserErrors } from '@app/errors';
import { AuthenticateUserDto } from './DTOs/authenticate-user.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenPayloadInterface } from './interfaces/token-payload.interface';
@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  getCookieWithJwtToken(userId: number) {
    const payload: TokenPayloadInterface = { userId };
    const token = this.jwtService.sign(payload);
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_EXPIRATION_TIME',
    )}s`;
  }
  public getCookieForLogOut() {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }
  public async register(registerationDto: RegistrationDto) {
    const { password } = registerationDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const createdUser = this.userRepository.create({
        ...registerationDto,
        password: hashedPassword,
      });
      const savedUser = await this.userRepository.save(createdUser);
      savedUser.password = undefined;
      return savedUser;
    } catch (e: any) {
      if (e?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(
          UserErrors.ALREADY_EXIST,
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        GlobalErrors.INTERNAL_SERVER_EROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async _verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );
    if (!isPasswordMatching) {
      throw new HttpException(
        UserErrors.WRONG_CREDENTIALS,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async authenticateUser({ email, password }: AuthenticateUserDto) {
    try {
      const user = await this.userRepository.findOne({ email });
      await this._verifyPassword(password, user.password);
      user.password = undefined;
      return user;
    } catch (error) {
      throw new HttpException(
        UserErrors.WRONG_CREDENTIALS,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
