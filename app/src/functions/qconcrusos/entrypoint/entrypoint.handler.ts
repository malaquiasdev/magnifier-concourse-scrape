import { APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";
import { EntryPointInput } from "../types/entrypoint.input";
import { EntryPointService } from "./service/entrypoint.service";

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
  const body: EntryPointInput = JSON.parse(event.body ?? "{}");
  if (!body.url || !body.mails) {
    return jsonSerializer(400, { msg: "Bad Request" });
  }
  const service = new EntryPointService();
  await service.saveEntryPointSate(body);
  return jsonSerializer(202, { msg: "Accept" });
}
