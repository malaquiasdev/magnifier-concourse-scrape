import pino, { Logger } from 'pino';
import { APIGatewayProxyResult, Context } from 'aws-lambda';
import { EntryPointInput } from '@qconcursos/types/entrypoint.input';
import { Database } from '@aws/database';
import { LambdaUtils } from '@aws/lambda';
import { AudityEntity } from '@qconcursos/entities/audity.entity';
import { EntryPointService } from '@qconcursos/services/entrypoint.service';
import { Gateway } from '@utils/gateway';
import { Validate } from '@utils/validate';

export class EntryPointController {
  private context: Context;
  private logger: Logger;
  private lambdaUtils: LambdaUtils;
  private entity: AudityEntity;
  private service: EntryPointService;
  private nextLambdaInvokeName: string;

  constructor(db: Database, context: Context, nextLambdaInvokeName?: string) {
    this.context = context;
    this.logger = pino();
    this.lambdaUtils = new LambdaUtils();
    this.entity = new AudityEntity(db, context);
    this.service = new EntryPointService(this.logger, this.entity, this.lambdaUtils);
    this.nextLambdaInvokeName = nextLambdaInvokeName;
  }

  public async handlerEvent(event: any): Promise<APIGatewayProxyResult> {
    this.logger.info(event);
    this.logger.info(this.context);

    const body: EntryPointInput = JSON.parse(event.body ?? '{}');
    try {
      if (!Validate.isUrl(body.url) || !body.mails) {
        return Gateway.jsonSerializer(400, { msg: 'Bad Request' });
      }
      await this.service.saveEntryPointSate(body, this.nextLambdaInvokeName, event);
      return Gateway.jsonSerializer(202, { msg: 'Accept' });
    } catch (error) {
      this.logger.error(error);
      return Gateway.jsonSerializer(500, { msg: 'Internal Server Error' });
    }
  }
}
