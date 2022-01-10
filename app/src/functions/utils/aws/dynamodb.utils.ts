import * as dotenv from "dotenv";
import AWS, { DynamoDB } from "aws-sdk";

dotenv.config();

export class DynamoDBUtils {
  private dynamodb: DynamoDB;

  constructor() {
    this.dynamodb = new AWS.DynamoDB({ region: process.env.AWS_REGION });
  }

  public async put(tableName: string, data: any): Promise<void> {
    const params = {
      TableName: tableName,
      Item: {
        ...data
      }
    };
    await this.dynamodb.putItem(params).promise();
  }

  public async batchWrite(tableName: string, array: any): Promise<void> {
    const items = array.map((data) => {
      return {
        PutRequest: {
          Item: {
            ...data
          }
        }
      };
    });

    var params = {
      RequestItems: {
        [tableName]: items
      }
    };

    await this.dynamodb.batchWriteItem(params).promise();
  }

  public async executePartiQL(query: string): Promise<any[]> {
    const data = [];
    let nextTokenRun = null;
    do {
      const { Items, NextToken } = await this.dynamodb
        .executeStatement({
          Statement: query,
          NextToken: nextTokenRun
        })
        .promise();

      data.push(...Items);
      nextTokenRun = NextToken;
    } while (nextTokenRun);
    return this.convertRecords(data);
  }

  private convertRecords(data: any): any {
    if (!data) return undefined;
    if (Array.isArray(data)) return this.convertRecordsToArray(data);
    return this.unmarshall(data);
  }

  private convertRecordsToArray(data: any): any[] {
    if (!data) return undefined;
    return data.map((item) => this.unmarshall(item));
  }

  private unmarshall(data: any): any {
    return AWS.DynamoDB.Converter.unmarshall(data);
  }
}
