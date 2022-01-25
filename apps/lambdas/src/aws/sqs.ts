import { SQS } from 'aws-sdk';
import pino, { Logger } from 'pino';

export class SQSUtils {
  private queueUrl: string;
  private sqs: SQS;
  private logger: Logger;

  constructor() {
    this.queueUrl = process.env.AWS_QUEUE_URL;
    this.sqs = new SQS({ region: process.env.AWS_REGION });
    this.logger = pino();
  }

  public async sendMessage(messageBody: string, messageAttributes: SQS.Types.MessageBodyAttributeMap): Promise<SQS.Types.SendMessageResult> {
    return await this.sqs
      .sendMessage({
        QueueUrl: this.queueUrl,
        MessageBody: messageBody,
        MessageAttributes: messageAttributes,
      })
      .promise();
  }

  public async registerToRedrive(
    message: string,
    messageAttributes: SQS.Types.MessageBodyAttributeMap,
    timerMilliseconds: number,
    delayMessageSeconds?: number,
  ): Promise<SQS.Types.SendMessageResult> {
    return new Promise(resolve => {
      setTimeout(async () => {
        this.logger.info(message);
        const item = await this.sqs
          .sendMessage({
            QueueUrl: this.queueUrl,
            MessageBody: message,
            MessageAttributes: messageAttributes,
            DelaySeconds: delayMessageSeconds,
          })
          .promise();
        this.logger.info(item);
        resolve(item);
      }, timerMilliseconds);
    });
  }
}
