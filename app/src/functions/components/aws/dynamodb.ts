import * as dotenv from "dotenv";
import AWS from "aws-sdk";

dotenv.config({
  path: "../../.env"
});

const dynamodb = new AWS.DynamoDB({ region: process.env.AWS_REGION });
const dynamoDBDocumentClient = new AWS.DynamoDB.DocumentClient();
const unmarshall = (data) => AWS.DynamoDB.Converter.unmarshall(data);

const TABLE_NAME = process.env["TABLE_NAME"];

function convertRecordsToArray(data: any): any[] {
  if (!data) return undefined;
  return data.map((item) => unmarshall(item));
}

export function convertRecordsToObject(data: any): any {
  if (!data) return undefined;
  if (Array.isArray(data)) return convertRecordsToArray(data);
  return unmarshall(data);
}

export async function getQuestionsWithNullAnswer(
  filter: string
): Promise<any[]> {
  const data = [];
  let nextRun = null;
  const query = `SELECT * FROM "${TABLE_NAME}" WHERE "answer" IS NULL AND "filter" = '${filter}'`;
  do {
    const { Items, NextToken } = await dynamodb
      .executeStatement({ Statement: query, NextToken: nextRun })
      .promise();
    data.push(...Items);
    nextRun = NextToken;
  } while (nextRun);
  return convertRecordsToObject(data);
}

export async function save(data: any) {
  const params = {
    TableName: TABLE_NAME,
    Item: {
      ...data
    }
  };
  await dynamoDBDocumentClient.put(params).promise();
}

export async function saveBatch(array: any) {
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
      [TABLE_NAME]: items
    }
  };

  await dynamoDBDocumentClient.batchWrite(params).promise();
}
