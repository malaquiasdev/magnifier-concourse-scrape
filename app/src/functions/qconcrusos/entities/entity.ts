import AWS from "aws-sdk";
import { Database } from "../../components/aws/database";

export abstract class Entity {
  private db: Database;

  constructor(database: Database) {
    this.db = database;
  }

  public async put(tableName: string, data: any): Promise<void> {
    const params = {
      TableName: tableName,
      Item: {
        ...data
      }
    };
    await this.db.getClient().put(params).promise();
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

    await this.db.getClient().batchWrite(params).promise();
  }

  public async executePartiQL(query: string): Promise<any[]> {
    const data = [];
    let nextTokenRun = null;
    do {
      const { Items, NextToken } = await this.db
        .getInstance()
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
