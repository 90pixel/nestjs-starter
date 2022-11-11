import { Controller, Get, Req } from '@nestjs/common';
import { Roles } from '../auth/lib/roles.decorator';
import { Role } from '../helpers/enums/role.enum';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { ResponseDto } from '../helpers/dto/response.dto';

@Controller('users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(Role.Admin, Role.User)
  @Get('me')
  async getProfile(@Req() req) {
    const response = await this.usersService.findMeById(req.user.id);
    return new ResponseDto(response);
  }
}
