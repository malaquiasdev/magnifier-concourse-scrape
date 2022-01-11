import { APIGatewayProxyResult } from "aws-lambda";

export class Gateway {
  private constructor() {}

  public static jsonSerializer(
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
}
