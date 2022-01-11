import { Context } from "aws-lambda";
import { Logger } from "pino";
import { Database } from "../../../../aws/database";
import { AudityEntity } from "../../entities/audity.entity";
import { Audity } from "../../entities/types/audity";
import { EntryPointInput } from "../../entrypoint/types/entrypoint.input";

export class QuestionAudity {
  private db: Database;
  private logger: Logger;

  constructor(db: Database, logger: Logger) {
    this.db = db;
    this.logger = logger;
  }

  public async audityFunction(
    { url, mails }: EntryPointInput,
    serviceName: string,
    context: Context
  ): Promise<void> {
    try {
      const audity: Audity = {
        page: url,
        mails: mails,
        serviceName: serviceName,
        filter: url.split("?")[1]
      };
      await new AudityEntity(this.db, context).persist(audity);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
