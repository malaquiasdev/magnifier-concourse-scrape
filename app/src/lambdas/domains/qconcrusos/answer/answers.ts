import { APIGatewayProxyResult, APIGatewayEvent, Context } from "aws-lambda";
import pino from "pino";
import { SQSUtils } from "../../../aws/sqs";
import { Gateway } from "../../../utils/gateway";
import { AnswerService } from "./service/answer.service";

const logger = pino();

function getFilter(event: any): string {
  const body = JSON.parse(event.body ?? "{}");
  if (body.filter) {
    return body.filter;
  }
  return event.Records[0].messageAttributes.filter;
}

export async function handler(
  event: any,
  context: Context
): Promise<APIGatewayProxyResult> {
  logger.info(event);
  logger.info(context);
  const service = new AnswerService();
  const sqs = new SQSUtils();
  try {
    const filter = getFilter(event);
    const message = `filter is ${filter}`;
    await Promise.race([
      service.scrapyAnswer(filter),
      service.startClockTimer(14.5 * 60 * 1000, message, sqs)
    ]);
  } catch (error) {
    logger.error(error);
    if (
      error.type === "TimeoutError" ||
      error.message.includes("No node found for selector") ||
      error.message.includes("waiting for selector")
    ) {
      await service.startClockTimer(0, "", sqs);
    }
  } finally {
    return Gateway.jsonSerializer(200, { msg: "finally" });
  }
}
