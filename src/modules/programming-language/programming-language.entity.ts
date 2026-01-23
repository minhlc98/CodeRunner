import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('programming_languages')
export class ProgrammingLanguage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ name: 'file_extension', type: 'varchar', length: 10 })
  fileExtension: string;

  @Column({ name: 'run_command', type: 'text', select: false })
  runCommand: string;

  @Column({ name: 'docker_image', type: 'text', select: false })
  dockerImage: string | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'default_code', type: 'text' })
  defaultCode: string | null;

  @Column({ type: 'int', default: 0, select: false })
  timeout: number; // in milliseconds

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
