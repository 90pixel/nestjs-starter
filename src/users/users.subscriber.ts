import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { User } from './entities/user.entity';

@EventSubscriber()
export class UsersSubscriber implements EntitySubscriberInterface<User> {
  listenTo() {
    return User;
  }

  //removed deprecated method
  async beforeInsert(event: InsertEvent<User>) {
    console.log('user before insert subscriber');
    console.log(event.entity, 'beforeInsert');
  }
}
