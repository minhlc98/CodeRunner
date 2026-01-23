import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { RUNNER } from 'src/shared/constant';

@Entity()
export class Runner {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'programming_language_id', type: 'varchar', length: 30 })
  programmingLanguageId: string;

  @Column({ type: 'varchar', length: 10000 })
  code: string;

  @Column({ type: 'varchar', length: 20, enum: RUNNER.LIST_STATUS, default: RUNNER.STATUS.IDLE })
  status: string;

  @Column({ type: 'varchar', nullable: true })
  error: string | null;

  @Column({ type: 'varchar', nullable: true })
  output: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @Column({ name: 'finished_at', type: 'timestamptz', default: null, nullable: true })
  finishedAt: Date;

  @Column({ type: 'int', default: 0 })
  duration: number; // in milliseconds
}