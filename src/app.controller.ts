import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('app')
@ApiTags('Core Func')
export class AppController {
  constructor(private readonly appService: AppService) {}
}
