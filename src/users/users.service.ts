import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { LoginDto } from '../auth/dto/login.dto';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from '../auth/dto/register.dto';
import { MeResponseDto } from './dto/me.response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async findOne(username: string): Promise<User> {
    return await this.usersRepository.findOne({
      where: { username: username },
    });
  }

  async findMeBySub(sub: string): Promise<MeResponseDto> {
    const result = await this.usersRepository.findOne({
      where: { sub: sub },
    });
    return new MeResponseDto(result);
  }

  async checkAuth(loginInfos: LoginDto): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { username: loginInfos.username },
    });

    if (user && (await bcrypt.compare(loginInfos.password, user.password))) {
      return user;
    }
    return null;
  }

  async create(registerInfo: RegisterDto): Promise<User> {
    const newUser = new User();
    newUser.username = registerInfo.username;
    newUser.salt = await bcrypt.genSalt();
    newUser.password = await bcrypt.hash(registerInfo.password, newUser.salt);
    await this.usersRepository.save(newUser);

    //sub is the unique identifier of the user timestamp+ userid
    newUser.sub = newUser.createdAt.getTime() + newUser.id.toString();
    return await this.usersRepository.save(newUser);
  }
}
