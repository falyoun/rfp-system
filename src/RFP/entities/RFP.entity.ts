import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Transform } from 'class-transformer';

@Entity()
export class RFPEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  @Transform((value) => {
    if (value !== null) {
      return value;
    }
  })
  @Column({ nullable: true })
  public description?: string;
}
