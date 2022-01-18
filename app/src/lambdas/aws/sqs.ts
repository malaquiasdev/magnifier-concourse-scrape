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
    messageAttributes: SQS.Types.MessageBodyAttributeMap
  ): Promise<SQS.Types.SendMessageResult> {
    return await this.sqs
      .sendMessage({
        QueueUrl: this.queueUrl,
        MessageBody: messageBody,
        MessageAttributes: messageAttributes
      })
      .promise();
  }

  public async registerToRedrive(
    messageAttributes: SQS.Types.MessageBodyAttributeMap,
    delaySeconds: number = 0
  ): Promise<SQS.Types.SendMessageResult> {
    return await this.sqs
      .sendMessage({
        QueueUrl: this.queueUrl,
        MessageBody: "Redrive",
        MessageAttributes: messageAttributes,
        DelaySeconds: delaySeconds
      })
      .promise();
  }
}
