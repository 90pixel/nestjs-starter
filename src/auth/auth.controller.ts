import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ResponseDto } from '../common/dto/response.dto';
import { Role } from '../common/enums/role.enum';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Roles } from './lib/roles.decorator';

@Controller('auth')
@ApiBearerAuth()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginInfo: LoginDto): Promise<ResponseDto> {
    const response = await this.authService.login(loginInfo);
    return new ResponseDto(response);
  }

  @Post('register')
  async register(@Body() registerInfo: RegisterDto): Promise<ResponseDto> {
    const response = await this.authService.register(registerInfo);
    return new ResponseDto(response);
  }

  @Roles(Role.User, Role.Admin)
  @Get('logout')
  async logout(@Req() req): Promise<ResponseDto> {
    let accessToken = req.headers.authorization ?? req.query['access-token'];
    //remove bearer from token
    accessToken = accessToken.replace('Bearer ', '');
    await this.authService.logout(accessToken);
    return new ResponseDto(null);
  }

  //get access token
  @Get('getAccessToken/:refreshToken')
  async getAccessToken(
    @Param('refresh_token') refresh_token: string,
  ): Promise<ResponseDto> {
    const response = await this.authService.getAccessToken(refresh_token);
    return new ResponseDto(response, 'Access token retrieved');
  }
}
