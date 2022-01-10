import AWS from "aws-sdk";
import dotenv from "dotenv";
import { ExportService } from "./service";

dotenv.config();

const dynamodb = new AWS.DynamoDB({ region: process.env.AWS_REGION });
const service = new ExportService(dynamodb);

export async function handler(event: any): Promise<any> {
  return service.parserDataToCsv(event.tableName, event.questionFilter);
}
