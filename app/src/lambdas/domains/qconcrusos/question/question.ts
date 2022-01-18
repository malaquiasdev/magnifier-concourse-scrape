import { APIGatewayProxyResult, APIGatewayEvent, Context } from "aws-lambda";
import pino from "pino";
import { Gateway } from "../../../utils/gateway";
import { EntryPointInput } from "../entrypoint/types/entrypoint.input";
import { QuestionService } from "./service/question.service";

const logger = pino();

function getBody(event: any): EntryPointInput {
  const body: EntryPointInput = JSON.parse(event.body ?? "{}");
  if (body.url && body.mails) {
    return body;
  }
  const attributes = event.Records[0].messageAttributes;
  return {
    url: attributes.url.stringValue,
    mails: JSON.parse(attributes.mails.stringValue)
  };
}

export async function handler(
  event: any,
  context: Context
): Promise<APIGatewayProxyResult> {
  logger.info(event);
  logger.info(context);
  const service = new QuestionService(context);
  try {
    const body: EntryPointInput = getBody(event);
    await Promise.race([
      service.main(body),
      service.startClockTimer(14.5 * 60 * 1000)
    ]);
  } catch (error) {
    logger.error(error);
    if (
      error.type === "TimeoutError" ||
      error.message.includes("No node found for selector") ||
      error.message.includes("waiting for selector")
    ) {
      await service.startClockTimer(0);
    }
  } finally {
    return Gateway.jsonSerializer(200, { msg: "finally" });
  }
}
