import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { MoreThan, Repository } from 'typeorm';
import { LoginDto } from '../auth/dto/login.dto';
import { RegisterDto } from '../auth/dto/register.dto';
import { PaginatorResponse } from '../utils/dto/paginator-response.dto';
import { UtilsService } from '../utils/utils.service';
import { MeResponseDto } from './dto/me.response.dto';
import { Users } from './entities/users.entity';

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
      relations: ['session_tokens'],
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
    return await this.utilsService.adminPagination(
      Users,
      { page: 1, limit: 2 },
      {
        order: { 'users.created_at': 'DESC' },
        where: { id: MoreThan(0) },
        relations: ['session_tokens'],
      },
      MeResponseDto,
    );
  }

  async create(registerInfo: RegisterDto): Promise<Users> {
    const newUser = new Users();
    newUser.username = registerInfo.username;
    newUser.salt = await bcrypt.genSalt();
    newUser.password = await bcrypt.hash(registerInfo.password, newUser.salt);

    return await this.usersRepository.save(newUser);
  }

  //example purpose
  async beforeUpdate(): Promise<void> {
    console.log('user before update service');
  }
}
