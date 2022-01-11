import * as dotenv from "dotenv";
import { Audity } from "../types/audity.entity";
import { Entity } from "./entity";
import { Database } from "../../components/aws/database";

dotenv.config();

export class AudityEntity extends Entity {
  private tableName;

  constructor(db: Database) {
    super(db);
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
