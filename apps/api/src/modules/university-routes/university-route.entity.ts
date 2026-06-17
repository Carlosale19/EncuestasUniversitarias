import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { Survey } from '../surveys/survey.entity.js';

@Entity({ name: 'university_routes' })
export class UniversityRoute {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'nombre_ruta', type: 'varchar', length: 120 })
  nombreRuta!: string;

  @Column({ type: 'text', nullable: true })
  descripcion!: string | null;

  @OneToMany(() => Survey, (survey) => survey.route)
  surveys!: Relation<Survey[]>;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
