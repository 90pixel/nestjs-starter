import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { Users } from './entities/users.entity';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
@EventSubscriber()
export class UsersSubscriber implements EntitySubscriberInterface<Users> {
  constructor(@InjectDataSource() readonly dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  listenTo() {
    return Users;
  }

  //removed deprecated method
  async beforeInsert(event: InsertEvent<Users>): Promise<void> {
    console.log('user before insert subscriber');
    console.log(event.entity, 'beforeInsert');
  }
}
