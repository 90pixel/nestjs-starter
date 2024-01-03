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
  access_token: string;

  @Column()
  expires_at: Date;

  @Column()
  refresh_token: string;

  @Column()
  expires_refresh_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  //one to many user
  @ManyToOne(() => Users, (user) => user.session_tokens, {
    onDelete: 'CASCADE',
  })
  user: Users;
}
