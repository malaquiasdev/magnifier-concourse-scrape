import { APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";
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
    body: JSON.stringify(result)
  };
}

export async function handler(
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> {
  logger.info(event);
  const { requestId } = event.requestContext;
  const body: EntryPointInput = JSON.parse(event.body ?? "{}");
  if (!body.url || !body.mails) {
    return jsonSerializer(400, { msg: "Bad Request" });
  }
  const service = new EntryPointService();
  await service.saveEntryPointSate(body, requestId);
  return jsonSerializer(202, { msg: "Accept" });
}
