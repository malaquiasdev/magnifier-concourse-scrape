import * as dotenv from "dotenv";
import { APIGatewayProxyResult, APIGatewayEvent, Context } from "aws-lambda";
import pino from "pino";
import { EntryPointInput } from "./types/entrypoint.input";
import { EntryPointService } from "./entrypoint.service";
import { Gateway } from "../../../utils/gateway";
import { Validate } from "../../../utils/validate";
import { LambdaUtils } from "../../../aws/lambda";
import { Database } from "../../../aws/database";
import { AudityEntity } from "../entities/audity.entity";

dotenv.config();
const logger = pino();

export async function handler(
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  logger.info(event);
  logger.info(context);

  const body: EntryPointInput = JSON.parse(event.body ?? "{}");

  const lambdaUtils = new LambdaUtils();
  const entity = new AudityEntity(new Database(), context);
  const service = new EntryPointService(logger, entity, lambdaUtils);

  try {
    if (!Validate.isUrl(body.url) || !body.mails) {
      return Gateway.jsonSerializer(400, { msg: "Bad Request" });
    }
    await service.saveEntryPointSate(body, process.env.NEXT_LAMBDA_INVOKE, event);
    return Gateway.jsonSerializer(202, { msg: "Accept" });
  } catch (error) {
    logger.error(error);
    return Gateway.jsonSerializer(500, { msg: "Internal Server Error" });
  }
}
