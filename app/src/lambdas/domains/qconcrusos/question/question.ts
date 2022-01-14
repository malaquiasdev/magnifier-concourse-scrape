import { APIGatewayProxyResult, APIGatewayEvent, Context } from "aws-lambda";
import pino from "pino";
import { Gateway } from "../../../utils/gateway";
import { EntryPointInput } from "../entrypoint/types/entrypoint.input";
import { QuestionService } from "./service/question.service";

const logger = pino();

function getBody(event: any): EntryPointInput {
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
  try {
    const body: EntryPointInput = getBody(event);
    const service = new QuestionService(context);
    await Promise.race([service.main(body), service.setTimout()]);
  } catch (error) {
    logger.error(error);
  } finally {
    return Gateway.jsonSerializer(200, { msg: "finally" });
  }
}
