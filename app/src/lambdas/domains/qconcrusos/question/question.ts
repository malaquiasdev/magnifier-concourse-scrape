import { APIGatewayProxyResult, APIGatewayEvent, Context } from "aws-lambda";
import pino from "pino";
import { Gateway } from "../../../utils/gateway";
import { QuestionService } from "./service/question.service";

const logger = pino();

export async function handler(
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  logger.info(event);
  logger.info(context);
  const body: any = JSON.parse(event.body ?? "{}");
  const service = new QuestionService(context);
  const questions = await service.main(body);
  return Gateway.jsonSerializer(202, { msg: "Accept" });
}
