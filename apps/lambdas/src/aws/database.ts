import AWS, { DynamoDB } from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

export class Database {
  private dynamodb: DynamoDB;
  private client: DocumentClient;

  constructor() {
    this.dynamodb = new AWS.DynamoDB({ region: process.env.AWS_REGION });

    this.client = new AWS.DynamoDB.DocumentClient({
      region: process.env.AWS_REGION,
    });
  }

  public getInstance(): DynamoDB {
    return this.dynamodb;
  }

  public getClient(): DocumentClient {
    return this.client;
  }
}
