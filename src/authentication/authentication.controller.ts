import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { RegistrationDto } from './DTOs/registration.dto';
import { LocalAuthenticationGuard } from './guards/local-authentication.guard';
import { RequestWithUserInterface } from './interfaces/request-with-user.interface';
import { Response } from 'express';
import { JwtAuthenticationGuard } from './guards/jwt-authentication.guard';
@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('register')
  register(@Body() registrationDto: RegistrationDto) {
    return this.authenticationService.register(registrationDto);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('login')
  async login(@Req() req: RequestWithUserInterface) {
    const { user } = req;
    console.log('user: ', user);
    const cookie = this.authenticationService.getCookieWithJwtToken(user.id);
    req.res.setHeader('Set-Cookie', cookie);
    user.password = undefined;
    return req.res.send(user);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('logout')
  logout(@Res() response: Response) {
    response.setHeader(
      'Set-Cookie',
      this.authenticationService.getCookieForLogOut(),
    );
    return response.sendStatus(200);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  authenticate(@Req() request: RequestWithUserInterface) {
    const { user } = request;
    user.password = undefined;
    return user;
  }
}
