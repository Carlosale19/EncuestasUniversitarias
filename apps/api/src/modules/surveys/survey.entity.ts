import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity.js';
import { UniversityRoute } from '../university-routes/university-route.entity.js';
import { SurveyQuestion } from './survey-question.entity.js';
import { SurveyResponse } from './survey-response.entity.js';

@Entity({ name: 'surveys' })
export class Survey {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => UniversityRoute, (route) => route.surveys, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'route_id' })
  route!: Relation<UniversityRoute>;

  @Column({ name: 'route_id', type: 'uuid' })
  routeId!: string;

  @ManyToOne(() => User, (user) => user.surveys, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'created_by' })
  createdBy!: Relation<User>;

  @Column({ name: 'created_by', type: 'uuid' })
  createdById!: string;

  @Column({ type: 'varchar', length: 180 })
  titulo!: string;

  @Column({ type: 'text', nullable: true })
  descripcion!: string | null;

  @Column({ name: 'public_slug', type: 'varchar', length: 180, unique: true })
  publicSlug!: string;

  @Column({ name: 'is_active', type: 'boolean', default: false })
  isActive!: boolean;

  @Column({ name: 'starts_at', type: 'timestamptz', nullable: true })
  startsAt!: Date | null;

  @Column({ name: 'ends_at', type: 'timestamptz', nullable: true })
  endsAt!: Date | null;

  @OneToMany(() => SurveyQuestion, (question) => question.survey, { cascade: true })
  questions!: Relation<SurveyQuestion[]>;

  @OneToMany(() => SurveyResponse, (response) => response.survey)
  responses!: Relation<SurveyResponse[]>;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
