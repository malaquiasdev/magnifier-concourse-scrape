import { APIGatewayProxyResult, APIGatewayEvent, Context } from "aws-lambda";
import pino from "pino";
import { EntryPointInput } from "./types/entrypoint.input";
import { EntryPointService } from "./entrypoint.service";
import { Gateway } from "../../../utils/gateway";
import { Validate } from "../../../utils/validate";

const logger = pino();

export async function handler(
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  logger.info(event);
  logger.info(context);

  const body: EntryPointInput = JSON.parse(event.body ?? "{}");
  if (!Validate.isUrl(body.url) || !body.mails) {
    return Gateway.jsonSerializer(400, { msg: "Bad Request" });
  }
  const service = new EntryPointService();
  await service.saveEntryPointSate(body, context);
  return Gateway.jsonSerializer(202, { msg: "Accept" });
}
