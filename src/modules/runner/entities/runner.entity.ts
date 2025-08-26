import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import _CONST from 'src/shared/_CONST';

@Entity()
export class Runner {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 30 })
  language: string;

  @Column({ type: 'varchar', length: 10000 })
  code: string;

  @Column({ type: 'varchar', length: 20, enum: _CONST.RUNNER.LIST_STATUS, default: _CONST.RUNNER.STATUS.IDLE })
  status: string;

  @Column({ type: 'varchar', default: null, nullable: true })
  error: string;

  @Column({ type: 'varchar', default: null, nullable: true })
  output: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: null, nullable: true })
  updatedAt: Date;

  @Column({ type: 'timestamp', default: null, nullable: true })
  finishedAt: Date;

  @Column({ type: 'int', default: 0 })
  duration: number; // in milliseconds
}