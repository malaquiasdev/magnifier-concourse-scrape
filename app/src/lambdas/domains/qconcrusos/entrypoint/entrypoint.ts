import * as dotenv from "dotenv";
import { APIGatewayProxyResult, APIGatewayEvent, Context } from "aws-lambda";
import pino from "pino";
import { EntryPointInput } from "./types/entrypoint.input";
import { EntryPointService } from "./entrypoint.service";
import { Gateway } from "../../../utils/gateway";
import { Validate } from "../../../utils/validate";
import { LambdaUtils } from "../../../aws/lambda";

dotenv.config();
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
  const lambdaUtils = new LambdaUtils();
  await lambdaUtils.invokeNextLambda(process.env.NEXT_LAMBDA_INVOKE, event);
  return Gateway.jsonSerializer(202, { msg: "Accept" });
}
