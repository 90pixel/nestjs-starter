import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import { MoreThan, Repository } from 'typeorm';
import { Users } from '../users/entities/users.entity';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login.response.dto';
import { RegisterDto } from './dto/register.dto';
import { SessionToken } from './entities/session-token';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(SessionToken)
    private sessionTokenRepository: Repository<SessionToken>,
  ) {}

  async login(loginInfo: LoginDto): Promise<LoginResponseDto> {
    const user = await this.usersService.checkAuth(loginInfo);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const payload = {
      id: user.id,
    };
    return await this.createToken(user, payload);
  }

  async logout(accessToken: string): Promise<void> {
    const sessionToken = await this.sessionTokenRepository.findOne({
      where: { access_token: accessToken },
    });
    if (sessionToken) {
      //update expiresAt to now
      sessionToken.expires_at = new Date();
      sessionToken.expires_refresh_at = new Date();
      await this.sessionTokenRepository.save(sessionToken);
    }
  }

  //get access token from refresh token
  async getAccessToken(refreshToken: string): Promise<LoginResponseDto> {
    //check if refresh token exist and not expired

    const sessionToken = await this.sessionTokenRepository.findOne({
      where: {
        refresh_token: refreshToken,
        expires_refresh_at: MoreThan(new Date()),
      },
      relations: ['user'],
    });

    if (!sessionToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    //update expiresAt to now
    sessionToken.expires_at = new Date();
    sessionToken.expires_refresh_at = new Date();
    //update session token
    await this.sessionTokenRepository.save(sessionToken);

    const payload = {
      id: sessionToken.user.id,
    };
    return await this.createToken(sessionToken.user, payload);
  }

  async register(registerInfo: RegisterDto): Promise<LoginResponseDto> {
    //if user exist
    const user = await this.usersService.findOne(registerInfo.username);
    if (user) throw new UnauthorizedException('Users already exist');
    const createdUser = await this.usersService.create(registerInfo);
    const payload = {
      id: createdUser.id,
    };

    return await this.createToken(createdUser, payload);
  }

  async createToken(user: Users, payload: any): Promise<LoginResponseDto> {
    const response = new LoginResponseDto();
    response.access_token = this.jwtService.sign(payload);
    response.refresh_token = await this.generateRefreshToken();
    const expiresAt = process.env.JWT_EXPIRES_IN;

    //add expiresAt string to Date
    const expiresAtDate = new Date();
    expiresAtDate.setSeconds(expiresAtDate.getSeconds() + parseInt(expiresAt));
    response.expires_at = expiresAtDate;

    //add expiresRefreshAt string to Date
    const expiresRefreshAt = process.env.JWT_REFRESH_EXPIRES_IN;
    const expiresRefreshAtDate = new Date();
    expiresRefreshAtDate.setSeconds(
      expiresRefreshAtDate.getSeconds() + parseInt(expiresRefreshAt),
    );
    response.expires_refresh_at = expiresRefreshAtDate;

    const sessionToken = new SessionToken();
    sessionToken.user = user;
    sessionToken.access_token = response.access_token;
    sessionToken.expires_at = response.expires_at;
    sessionToken.refresh_token = response.refresh_token;
    sessionToken.expires_refresh_at = response.expires_refresh_at;
    await this.sessionTokenRepository.save(sessionToken);

    return response;
  }

  async generateRefreshToken(): Promise<string> {
    return crypto.randomBytes(32).toString('hex');
  }

  async validateAccessToken(accessToken: string): Promise<Users> {
    try {
      const payload = this.jwtService.verify(accessToken);
      const token = await this.sessionTokenRepository.findOne({
        where: { access_token: accessToken, expires_at: MoreThan(new Date()) },
        relations: ['user'],
      });
      if (!token) throw new UnauthorizedException('Invalid access token');

      if (token.user.id !== payload.id)
        throw new UnauthorizedException('Invalid access token');
      return token.user;
    } catch (e) {
      throw new UnauthorizedException('Invalid access token');
    }
  }
}
