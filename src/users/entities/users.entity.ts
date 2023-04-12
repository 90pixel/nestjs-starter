import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../../common/enums/role.enum';
import { SessionToken } from '../../auth/entities/session-token';
import { Exclude } from 'class-transformer';

@Entity()
export class Users {
  @Index()
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Index({ unique: true })
  @Column()
  username: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ type: 'enum', enum: Role, default: [Role.User] })
  role: Role;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  salt: string;

  @UpdateDateColumn()
  updatedAt: Date;

  //one to many session
  @OneToMany(() => SessionToken, (sessionToken) => sessionToken.user, {
    cascade: true,
  })
  sessionTokens: SessionToken[];

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  toJSON() {
    return { ...this, password: undefined };
  }
}
