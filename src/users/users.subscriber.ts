import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { Users } from './entities/users.entity';

@EventSubscriber()
export class UsersSubscriber implements EntitySubscriberInterface<Users> {
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
