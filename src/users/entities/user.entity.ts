import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../../helpers/enums/role.enum';
import { SessionToken } from '../../auth/entities/session-token';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column()
  username: string;

  @Column()
  password: string;

  @Index()
  @Column({ type: 'enum', enum: Role, default: [Role.User] })
  role: Role;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  //one to many session
  @OneToMany((type) => SessionToken, (sessionToken) => sessionToken.user)
  sessionTokens: Promise<SessionToken[]>;
}
