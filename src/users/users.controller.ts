import { Controller, Get } from '@nestjs/common';
import { Roles } from '../auth/lib/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { ResponseDto } from '../common/dto/response.dto';
import { CurrentUser } from '../auth/lib/current-user';
import { User } from './entities/user.entity';
import { PaginatorResponse } from '../common/helpers/paginator-response.dto';

@Controller('users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(Role.Admin, Role.User)
  @Get('me')
  async getProfile(@CurrentUser() user: User): Promise<ResponseDto> {
    return new ResponseDto(user);
  }

  @Get('all')
  async findAll(): Promise<PaginatorResponse> {
    return await this.usersService.paginateAll();
  }
}
