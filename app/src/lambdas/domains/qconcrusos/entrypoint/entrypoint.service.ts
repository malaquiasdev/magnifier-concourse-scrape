import { AudityEntity } from "../entities/audity.entity";
import { EntryPointInput } from "./types/entrypoint.input";
import { Audity } from "../entities/types/audity";
import { Logger } from "pino";
import { LambdaUtils } from "../../../aws/lambda";

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
    event: any,
    nextLambdaName: string
  ): Promise<void> {
    try {
      await this.audity.persist({
        page: event.body.url,
        mails: event.body.mails,
        serviceName: this.saveEntryPointSate.name,
        filter: event.body.url.split("?")[1]
      });
      await this.lambdaUtils.invokeNextLambda(nextLambdaName, event);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
