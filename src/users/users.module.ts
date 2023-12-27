import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtilsModule } from '../utils/utils.module';
import { Users } from './entities/users.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersSubscriber } from './users.subscriber';

@Module({
  imports: [TypeOrmModule.forFeature([Users]), UtilsModule],
  providers: [UsersService, UsersSubscriber],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
