import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { Survey } from './survey.entity.js';
import { ResponseAnswer } from './response-answer.entity.js';

@Entity({ name: 'survey_responses' })
export class SurveyResponse {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Survey, (survey) => survey.responses, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'survey_id' })
  survey!: Relation<Survey>;

  @Column({ name: 'survey_id', type: 'uuid' })
  surveyId!: string;

  @Column({ name: 'student_code', type: 'varchar', length: 50, nullable: true })
  studentCode!: string | null;

  @Column({ name: 'student_name', type: 'varchar', length: 160, nullable: true })
  studentName!: string | null;

  @Column({ name: 'student_email', type: 'varchar', length: 160, nullable: true })
  studentEmail!: string | null;

  @Column({ name: 'ip_address', type: 'inet', nullable: true })
  ipAddress!: string | null;

  @Column({ name: 'user_agent', type: 'varchar', length: 512, nullable: true })
  userAgent!: string | null;

  @OneToMany(() => ResponseAnswer, (answer) => answer.response, { cascade: true })
  answers!: Relation<ResponseAnswer[]>;

  @CreateDateColumn({ name: 'submitted_at', type: 'timestamptz' })
  submittedAt!: Date;
}
