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
import { Survey } from './survey.entity.js';
import { QuestionType } from './question-type.enum.js';
import { QuestionOption } from './question-option.entity.js';
import { ResponseAnswer } from './response-answer.entity.js';

@Entity({ name: 'survey_questions' })
export class SurveyQuestion {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Survey, (survey) => survey.questions, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'survey_id' })
  survey!: Relation<Survey>;

  @Column({ name: 'survey_id', type: 'uuid' })
  surveyId!: string;

  @Column({ type: 'varchar', length: 200 })
  titulo!: string;

  @Column({ type: 'text', nullable: true })
  descripcion!: string | null;

  @Column({ name: 'question_type', type: 'enum', enum: QuestionType })
  questionType!: QuestionType;

  @Column({ type: 'boolean', default: true })
  requerida!: boolean;

  @Column({ type: 'int' })
  orden!: number;

  @OneToMany(() => QuestionOption, (option) => option.question, { cascade: true })
  options!: Relation<QuestionOption[]>;

  @OneToMany(() => ResponseAnswer, (answer) => answer.question)
  answers!: Relation<ResponseAnswer[]>;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
