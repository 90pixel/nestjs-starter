import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class SessionToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column()
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
  @ManyToOne(() => User, (user) => user.sessionTokens, {
    onDelete: 'CASCADE',
  })
  user: Promise<User>;
}
