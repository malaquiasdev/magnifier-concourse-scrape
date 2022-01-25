import pino, { Logger } from 'pino';
import { Context, APIGatewayProxyResult } from 'aws-lambda';
import { Database } from '@aws/database';
import { SQSUtils } from '@aws/sqs';
import { QuestionEntity } from '@qconcursos/entities/question.entity';
import { QuestionService } from '@qconcursos/services/question.service';
import { BodyParser } from '@utils/body.parser';
import { Gateway } from '@utils/gateway';

export class QuestionController {
  private service: QuestionService;
  private logger: Logger;
  private bodyParser: BodyParser;
  private sqs: SQSUtils;
  private timer: number;

  constructor(nextLambdaName: string) {
    this.timer = 14.5 * 60 * 1000;
    this.logger = pino();
    this.sqs = new SQSUtils();
    this.service = new QuestionService(this.logger, this.sqs, new QuestionEntity(new Database()), nextLambdaName);
    this.bodyParser = new BodyParser();
  }

  public async handlerQuestionEvent(event: any, context: Context): Promise<APIGatewayProxyResult> {
    this.logger.info(event);
    this.logger.info(context);
    try {
      const body = this.bodyParser.getEntryPoint(event);
      await Promise.race([this.service.scrapyQuestions(body), this.service.startClockTimer(this.timer)]);
      return Gateway.jsonSerializer(200, { msg: 'OK' });
    } catch (error) {
      this.logger.error(error);
      if (error.type === 'TimeoutError' || error.message.includes('No node found for selector') || error.message.includes('waiting for selector')) {
        await this.service.startClockTimer(0);
      }
      return Gateway.jsonSerializer(206, { msg: 'Partial Content' });
    }
  }
}
