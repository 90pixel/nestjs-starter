import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from '../../users/entities/users.entity';

@Entity()
export class SessionToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column({ length: 500 })
  accessToken: string;

  @Column()
  expiresAt: Date;

  @Column()
  refreshToken: string;

  @Column()
  expiresRefreshAt: Date;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  //one to many user
  @ManyToOne(() => Users, (user) => user.sessionTokens, {
    onDelete: 'CASCADE',
  })
  user: Users;
}
