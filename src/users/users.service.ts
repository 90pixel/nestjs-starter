import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { MoreThan, Repository } from 'typeorm';
import { LoginDto } from '../auth/dto/login.dto';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from '../auth/dto/register.dto';
import { PagePaginator } from '../common/helpers/page-paginator';
import { PaginatorResponse } from '../common/helpers/paginator-response.dto';

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

  async checkAuth(loginInfos: LoginDto): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { username: loginInfos.username },
    });

    if (user && (await bcrypt.compare(loginInfos.password, user.password))) {
      return user;
    }
    return null;
  }

  async paginateAll(): Promise<PaginatorResponse> {
    //create pagination object
    const pagination = new PagePaginator();
    //
    return await pagination.paginate(
      //identify your table to use
      this.usersRepository.createQueryBuilder(),
      {
        //default is 1
        page: 1,
        //default is 10
        take: 3,
        //true for asc, false for desc, default is id desc
        orderBy: { id: false },
        //you can use typeorm where clause
        where: { id: MoreThan(0) },
        //add relations if you want take them too
        relations: ['sessionTokens'],
      },
    );
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
