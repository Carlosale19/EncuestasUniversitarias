import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  ManyToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { SurveyQuestion } from './survey-question.entity.js';
import { ResponseAnswer } from './response-answer.entity.js';

@Entity({ name: 'question_options' })
export class QuestionOption {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => SurveyQuestion, (question) => question.options, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'question_id' })
  question!: Relation<SurveyQuestion>;

  @Column({ name: 'question_id', type: 'uuid' })
  questionId!: string;

  @Column({ type: 'varchar', length: 160 })
  etiqueta!: string;

  @Column({ type: 'varchar', length: 160 })
  valor!: string;

  @Column({ type: 'int' })
  orden!: number;

  @ManyToMany(() => ResponseAnswer, (answer) => answer.selectedOptions)
  answers!: Relation<ResponseAnswer[]>;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
