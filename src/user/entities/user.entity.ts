import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AppFileEntity } from '../../../shared/file-upload/src';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column({ unique: true })
  public email: string;

  @Column({ select: false })
  password: string;

  @Column()
  name: string;

  @JoinColumn()
  @OneToOne(() => AppFileEntity, {
    eager: true,
    nullable: true,
  })
  public avatar?: AppFileEntity;
}
