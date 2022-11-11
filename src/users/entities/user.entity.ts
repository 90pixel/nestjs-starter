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

  @Column({ nullable: true })
  salt: string;

  @UpdateDateColumn()
  updatedAt: Date;

  //one to many session
  @OneToMany(() => SessionToken, (sessionToken) => sessionToken.user, {
    cascade: true,
  })
  sessionTokens: Promise<SessionToken[]>;
}
