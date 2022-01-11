import { AudityEntity } from "../../entities/audity.entity";
import { EntryPointInput } from "../../types/entrypoint.input";
import { Audity } from "../../types/audity.entity";
import { Database } from "../../../components/aws/database";
import pino, { Logger } from "pino";

export class EntryPointService {
  private db: Database;
  private logger: Logger;

  constructor() {
    this.db = new Database();
    this.logger = pino();
  }

  public async saveEntryPointSate(
    { url, mails }: EntryPointInput,
    requestId: string
  ): Promise<void> {
    try {
      const audity: Audity = {
        requestId,
        page: url,
        mails: mails,
        serviceName: this.saveEntryPointSate.name,
        filter: url.split("?")[1],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await new AudityEntity(this.db).save(audity);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
