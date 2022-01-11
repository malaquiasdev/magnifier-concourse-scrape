import { APIGatewayProxyResult, APIGatewayEvent, Context } from "aws-lambda";
import pino from "pino";
import { EntryPointInput } from "../types/entrypoint.input";
import { EntryPointService } from "./service/entrypoint.service";
const logger = pino();

function jsonSerializer(
  statusCode: number,
  result: object
): APIGatewayProxyResult {
  return {
    statusCode: statusCode,
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify(result)
  };
}

function isUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch (e) {
    logger.error(e);
    return false;
  }
}

export async function handler(
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  logger.info(event);
  logger.info(context);

  const body: EntryPointInput = JSON.parse(event.body ?? "{}");
  if (!isUrl(body.url) || !body.mails) {
    return jsonSerializer(400, { msg: "Bad Request" });
  }
  const service = new EntryPointService();
  await service.saveEntryPointSate(body, context);
  return jsonSerializer(202, { msg: "Accept" });
}
