import AWS, { Lambda } from "aws-sdk";
import { APIGatewayEvent } from "aws-lambda";
import { InvokeAsyncRequest } from "aws-sdk/clients/lambda";

export class LambdaUtils {
  private lambda: Lambda;
  constructor() {
    this.lambda = new AWS.Lambda();
  }

  public async invokeNextLambda(
    functionName: string,
    event: any
  ): Promise<void> {
    const params: InvokeAsyncRequest = {
      FunctionName: functionName,
      InvokeArgs: JSON.stringify({
        ...event
      })
    };
    await this.lambda.invokeAsync(params).promise();
  }
}
