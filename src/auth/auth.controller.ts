import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResponseDto } from '../helpers/dto/response.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from './lib/roles.decorator';
import { Role } from '../helpers/enums/role.enum';

@Controller('auth')
@ApiBearerAuth()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginInfo: LoginDto) {
    const response = await this.authService.login(loginInfo);
    return new ResponseDto(response);
  }

  @Post('register')
  async register(@Body() registerInfo: RegisterDto) {
    const response = await this.authService.register(registerInfo);
    return new ResponseDto(response);
  }

  @Roles(Role.User, Role.Admin)
  @Get('logout')
  async logout(@Req() req) {
    let accessToken = req.headers.authorization ?? req.query['access-token'];
    //remove bearer from token
    accessToken = accessToken.replace('Bearer ', '');
    await this.authService.logout(accessToken);
    return new ResponseDto(null);
  }

  //get access token
  @Get('getAccessToken/:refreshToken')
  async getAccessToken(
    @Req() req,
    @Param('refreshToken') refreshToken: string,
  ) {
    const response = await this.authService.getAccessToken(
      req.params['refreshToken'],
    );
    return new ResponseDto(
      response,
      'Access token retrieved',
      HttpStatus.BAD_REQUEST,
    );
  }
}
