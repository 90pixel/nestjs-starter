import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entities/users.entity';
import { MoreThan, Repository } from 'typeorm';
import { LoginDto } from '../auth/dto/login.dto';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from '../auth/dto/register.dto';
import { UtilsService } from '../utils/utils.service';
import { PaginatorResponse } from '../utils/dto/paginator-response.dto';
import { MeResponseDto } from './dto/me.response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    @Inject(UtilsService)
    private readonly utilsService: UtilsService,
  ) {}

  async findOne(username: string): Promise<Users> {
    return await this.usersRepository.findOne({
      where: { username: username },
      relations: ['sessionTokens'],
    });
  }

  async checkAuth(loginInfos: LoginDto): Promise<Users> {
    const user = await this.usersRepository.findOne({
      where: { username: loginInfos.username },
    });

    if (user && (await bcrypt.compare(loginInfos.password, user.password))) {
      return user;
    }
    return null;
  }

  async paginateAll(): Promise<PaginatorResponse> {
    return await this.utilsService.getPagination(
      Users,
      { page: 1, limit: 2 },
      {
        order: { 'users.id': 'DESC' },
        where: { id: MoreThan(0) },
        relations: ['sessionTokens'],
      },
      MeResponseDto,
    );
  }

  async create(registerInfo: RegisterDto): Promise<Users> {
    const newUser = new Users();
    newUser.username = registerInfo.username;
    newUser.salt = await bcrypt.genSalt();
    newUser.password = await bcrypt.hash(registerInfo.password, newUser.salt);
    await this.usersRepository.save(newUser);

    //sub is the unique identifier of the user timestamp+ userid
    newUser.sub = newUser.createdAt.getTime() + newUser.id.toString();
    return await this.usersRepository.save(newUser);
  }
}
