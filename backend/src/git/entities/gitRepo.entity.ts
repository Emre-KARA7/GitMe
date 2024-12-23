import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class GitRepo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  path: string;

  @Column({ default: new Date() })
  createdAt: Date;

  @Column()
  ownerId: number;
}
