import { AudityEntity } from "../entities/audity.entity";
import { Logger } from "pino";
import { LambdaUtils } from "../../../aws/lambda";
import { EntryPointInput } from "./types/entrypoint.input";

export class EntryPointService {
  private logger: Logger;
  private audity: AudityEntity;
  private lambdaUtils: LambdaUtils;

  constructor(logger: Logger, entity: AudityEntity, lambdaUtils: LambdaUtils) {
    this.logger = logger;
    this.audity = entity;
    this.lambdaUtils = lambdaUtils;
  }

  public async saveEntryPointSate(
    { url, mails }: EntryPointInput,
    nextLambdaName: string,
    event: any
  ): Promise<void> {
    try {
      await this.audity.persist({
        page: url,
        mails: mails,
        serviceName: this.saveEntryPointSate.name,
        filter: url.split("?")[1]
      });
      await this.lambdaUtils.invokeNextLambda(nextLambdaName, event);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
