import { Database } from '@aws/database';
import { Entity } from '@qconcursos/entities/entity';
import { Question } from '@qconcursos/types/question';

export class QuestionEntity extends Entity {
  private tableName: string;

  constructor(db: Database) {
    super(db);
    this.tableName = process.env.QUESTION_TABLE_NAME;
  }

  public async batchPersist(questions: Question[]): Promise<void> {
    await super.batchWrite(this.tableName, questions);
  }

  public async persist(question: Question): Promise<void> {
    await super.put(this.tableName, question);
  }

  public async findByFilterAndAnswerNull(filter: string): Promise<Question[]> {
    const query = `SELECT * FROM "${this.tableName}" WHERE "answer" IS NULL AND "filter" = '${filter}'`;
    return super.executePartiQL(query);
  }
}
