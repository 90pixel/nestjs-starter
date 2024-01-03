import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SessionToken } from '../../auth/entities/session-token';
import { Role } from '../../common/enums/role.enum';

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
  created_at: Date;

  @Column()
  salt: string;

  @UpdateDateColumn()
  updated_at: Date;

  //one to many session
  @OneToMany(() => SessionToken, (sessionToken) => sessionToken.user, {
    cascade: true,
  })
  session_tokens: SessionToken[];

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  toJSON() {
    return { ...this, password: undefined };
  }
}
