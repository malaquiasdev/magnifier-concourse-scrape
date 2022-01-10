import * as dotenv from "dotenv";
import { DynamoDBUtils } from "../../utils/aws/dynamodb.utils";
import { Audity } from "../types/audity.entity";

dotenv.config();

export class AudityEntity extends DynamoDBUtils {
  private tableName;
  constructor() {
    super();
    this.tableName = process.env.AUDITY_TABLE_NAME;
  }

  public async save(audity: Audity): Promise<void> {
    await this.put(this.tableName, audity);
  }

  public async findByFilter(filter: string): Promise<Audity[]> {
    const query = `SELECT * FROM "${this.tableName}" WHERE "filter" = '${filter}'`;
    return this.executePartiQL(query);
  }
}
