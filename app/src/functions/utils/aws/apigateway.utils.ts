import { APIGatewayProxyResult } from "aws-lambda";

export class ApiGatewayUtils {
  constructor() {}

  public jsonSerializer<Event>(
    handler: (event: Event) => Promise<object>
  ): (event: Event) => Promise<APIGatewayProxyResult> {
    return async (event: Event) => {
      return {
        statusCode: 200,
        body: JSON.stringify(await handler(event))
      };
    };
  }
}
