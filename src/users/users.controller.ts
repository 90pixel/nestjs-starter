import { Controller, Get, Inject } from '@nestjs/common';
import { Roles } from '../auth/lib/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { ResponseDto } from '../common/dto/response.dto';
import { CurrentUser } from '../auth/lib/current-user';
import { Users } from './entities/users.entity';
import { PaginatorResponse } from '../utils/dto/paginator-response.dto';
import { UtilsService } from '../utils/utils.service';
import { MeResponseDto } from './dto/me.response.dto';

@Controller('users')
@ApiBearerAuth()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @Inject(UtilsService)
    private readonly utilsService: UtilsService,
  ) {}

  @Roles(Role.Admin, Role.User)
  @Get('me')
  async getProfile(@CurrentUser() user: Users): Promise<ResponseDto> {
    const getUser = await this.usersService.findOne(user.username);
    const result = await this.utilsService.autoMapper(getUser, MeResponseDto);
    return new ResponseDto(result);
  }

  @Get('all')
  async findAll(): Promise<PaginatorResponse> {
    return await this.usersService.paginateAll();
  }
}
