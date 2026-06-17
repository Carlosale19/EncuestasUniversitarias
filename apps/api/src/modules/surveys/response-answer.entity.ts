import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { SurveyResponse } from './survey-response.entity.js';
import { SurveyQuestion } from './survey-question.entity.js';
import { QuestionOption } from './question-option.entity.js';

@Entity({ name: 'response_answers' })
export class ResponseAnswer {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => SurveyResponse, (response) => response.answers, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'response_id' })
  response!: Relation<SurveyResponse>;

  @Column({ name: 'response_id', type: 'uuid' })
  responseId!: string;

  @ManyToOne(() => SurveyQuestion, (question) => question.answers, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'question_id' })
  question!: Relation<SurveyQuestion>;

  @Column({ name: 'question_id', type: 'uuid' })
  questionId!: string;

  @Column({ name: 'value_text', type: 'text', nullable: true })
  valueText!: string | null;

  @Column({ name: 'value_number', type: 'numeric', precision: 10, scale: 2, nullable: true })
  valueNumber!: number | null;

  @ManyToMany(() => QuestionOption, (option) => option.answers)
  @JoinTable({
    name: 'answer_selected_options',
    joinColumn: { name: 'answer_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'option_id', referencedColumnName: 'id' },
  })
  selectedOptions!: Relation<QuestionOption[]>;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}
