import { SQS } from "aws-sdk";

export class SQSUtils {
  private queueUrl: string;
  private sqs: SQS;

  constructor() {
    this.queueUrl = process.env.AWS_QUEUE_URL;
    this.sqs = new SQS({ region: process.env.AWS_REGION });
  }

  public async sendMessage(
    messageBody: string,
    messageAttributes: any
  ): Promise<any> {
    return await this.sqs
      .sendMessage({
        QueueUrl: this.queueUrl,
        MessageBody: messageBody,
        MessageAttributes: messageAttributes
      })
      .promise();
  }
}
