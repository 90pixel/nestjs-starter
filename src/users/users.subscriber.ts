import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { User } from './entities/user.entity';

@EventSubscriber()
export class UsersSubscriber implements EntitySubscriberInterface<User> {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  listenTo() {
    return User;
  }

  //removed deprecated method
  async beforeInsert(event: InsertEvent<User>): Promise<void> {
    console.log('user before insert subscriber');
    console.log(event.entity, 'beforeInsert');
  }
}
