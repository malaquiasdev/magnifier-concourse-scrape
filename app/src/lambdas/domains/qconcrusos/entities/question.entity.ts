import * as dotenv from "dotenv";
import { Database } from "../../../aws/database";
import { Entity } from "./entity";
import { Question } from "./types/question";

dotenv.config();

export class QuestionEntity extends Entity {
  private tableName: string;

  constructor(db: Database) {
    super(db);
    this.tableName = process.env.QUESTION_TABLE_NAME;
  }

  public async batchPersist(questions: Question[]): Promise<void> {
    await this.batchWrite(this.tableName, questions);
  }

  public async persist(question: Question): Promise<void> {
    await this.put(this.tableName, question);
  }

  public async findByFilterAndAnswerNull(filter: string): Promise<Question[]> {
    const query = `SELECT * FROM "${this.tableName}" WHERE "answer" IS NULL AND "filter" = '${filter}'`;
    return this.executePartiQL(query);
  }
}
