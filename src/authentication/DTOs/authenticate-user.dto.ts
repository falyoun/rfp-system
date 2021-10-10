import { RegistrationDto } from './registration.dto';
import { PartialType } from '@nestjs/mapped-types';

export class AuthenticateUserDto extends PartialType(RegistrationDto) {}
