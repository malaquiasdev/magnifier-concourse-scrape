import { AudityEntity } from "../../entities/audity.entity";
import { EntryPointInput } from "../../types/entrypoint.input";
import { Audity } from "../../types/audity.entity";

export class EntryPointService {
  constructor() {}

  public async saveEntryPointSate({
    url,
    mails
  }: EntryPointInput): Promise<void> {
    const audity: Audity = {
      page: url,
      mails: mails,
      processName: this.saveEntryPointSate.toString(),
      filter: url.split("?")[1],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await new AudityEntity().save(audity);
  }
}
