import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginResponseDto } from './dto/login.response.dto';
import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { SessionToken } from './entities/session-token';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(SessionToken)
    private sessionTokenRepository: Repository<SessionToken>,
  ) {}

  async login(loginInfo: LoginDto) {
    const user = await this.usersService.checkAuth(loginInfo);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const payload = {
      sub: user.salt,
    };
    return await this.createToken(user, payload);
  }

  async logout(accessToken: string) {
    const sessionToken = await this.sessionTokenRepository.findOne({
      where: { accessToken: accessToken },
    });
    if (sessionToken) {
      //update expiresAt to now
      sessionToken.expiresAt = new Date();
      sessionToken.expiresRefreshAt = new Date();
      await this.sessionTokenRepository.save(sessionToken);
    }
  }

  //get access token from refresh token
  async getAccessToken(refreshToken: string): Promise<LoginResponseDto> {
    //check if refresh token exist and not expired

    const sessionToken = await this.sessionTokenRepository.findOne({
      where: {
        refreshToken: refreshToken,
        expiresRefreshAt: MoreThan(new Date()),
      },
    });

    if (!sessionToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    //update expiresAt to now
    sessionToken.expiresAt = new Date();
    sessionToken.expiresRefreshAt = new Date();
    //update session token
    await this.sessionTokenRepository.save(sessionToken);

    const user = await Promise.resolve(sessionToken.user);

    const payload = {
      sub: user.salt,
    };
    return this.createToken(user, payload);
  }

  async register(registerInfo: RegisterDto): Promise<LoginResponseDto> {
    //if user exist
    const user = await this.usersService.findOne(registerInfo.username);
    if (user) throw new UnauthorizedException('User already exist');
    const createdUser = await this.usersService.create(registerInfo);
    const payload = {
      sub: createdUser.salt,
    };

    return await this.createToken(createdUser, payload);
  }

  async createToken(user: User, payload: any): Promise<LoginResponseDto> {
    const response = new LoginResponseDto();
    response.accessToken = this.jwtService.sign(payload);
    response.refreshToken = await this.generateRefreshToken();
    const expiresAt = process.env.JWT_EXPIRES_IN;

    //add expiresAt string to Date
    const expiresAtDate = new Date();
    expiresAtDate.setSeconds(expiresAtDate.getSeconds() + parseInt(expiresAt));
    response.expiresAt = expiresAtDate;

    //add expiresRefreshAt string to Date
    const expiresRefreshAt = process.env.JWT_REFRESH_EXPIRES_IN;
    const expiresRefreshAtDate = new Date();
    expiresRefreshAtDate.setSeconds(
      expiresRefreshAtDate.getSeconds() + parseInt(expiresRefreshAt),
    );
    response.expiresRefreshAt = expiresRefreshAtDate;

    const sessionToken = new SessionToken();
    sessionToken.user = Promise.resolve(user);
    sessionToken.accessToken = response.accessToken;
    sessionToken.expiresAt = response.expiresAt;
    sessionToken.refreshToken = response.refreshToken;
    sessionToken.expiresRefreshAt = response.expiresRefreshAt;
    await this.sessionTokenRepository.save(sessionToken);

    return response;
  }

  async generateRefreshToken(): Promise<string> {
    return crypto.randomBytes(32).toString('hex');
  }

  async validateAccessToken(accessToken: string): Promise<User> {
    const payload = this.jwtService.verify(accessToken);
    const token = await this.sessionTokenRepository.find({
      where: { accessToken: accessToken, expiresAt: MoreThan(new Date()) },
    });
    if (!token) throw new UnauthorizedException('Invalid access token');
    const user = await Promise.resolve(token[0].user);
    if (user.salt !== payload.sub)
      throw new UnauthorizedException('Invalid access token');
    return user;
  }
}
