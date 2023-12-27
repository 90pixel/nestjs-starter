import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { Users } from './entities/users.entity';
import { UsersService } from './users.service';

@Injectable()
@EventSubscriber()
export class UsersSubscriber implements EntitySubscriberInterface<Users> {
  constructor(
    @InjectDataSource() readonly dataSource: DataSource,
    private readonly userService: UsersService,
  ) {
    dataSource.subscribers.push(this);
  }
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  listenTo() {
    return Users;
  }

  //example purpose
  async beforeInsert(event: InsertEvent<Users>): Promise<void> {
    await this.userService.beforeUpdate();
    console.log(event.entity, 'beforeInsert');
  }
}
