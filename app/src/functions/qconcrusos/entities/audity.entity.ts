import * as dotenv from "dotenv";
import { Audity } from "../types/audity.entity";
import { Entity } from "./entity";
import { Database } from "../../components/aws/database";
import { Context } from "aws-lambda";

dotenv.config();

export class AudityEntity extends Entity {
  private tableName: string;
  private requestId: string;
  private functionName: string;

  constructor(db: Database, context: Context) {
    super(db);
    this.tableName = process.env.AUDITY_TABLE_NAME;
    this.requestId = context.awsRequestId;
    this.functionName = context.functionName;
  }

  public async persist(audity: Audity): Promise<void> {
    audity.createdAt = new Date().toISOString();
    audity.updatedAt = new Date().toISOString();
    audity.requestId = this.requestId;
    audity.functionName = this.functionName;
    await this.put(this.tableName, audity);
  }

  public async findByFilter(filter: string): Promise<Audity[]> {
    const query = `SELECT * FROM "${this.tableName}" WHERE "filter" = '${filter}'`;
    return this.executePartiQL(query);
  }
}
