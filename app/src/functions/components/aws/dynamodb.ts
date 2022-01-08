import AWS from "aws-sdk";
import pino from "pino";

const dynamoDBDocumentClient = new AWS.DynamoDB.DocumentClient();
const unmarshall = (data) => AWS.DynamoDB.Converter.unmarshall(data);

const TABLE_NAME = process.env["TABLE_NAME"];

export async function save(data: any) {
  const params = {
    TableName: TABLE_NAME,
    Item: {
      ...data,
    },
  };
  await dynamoDBDocumentClient.put(params).promise();
}

export async function saveBatch(array: any) {
  const items = array.map((data) => {
    return {
      PutRequest: {
        Item: {
          ...data,
        },
      },
    };
  });
  var params = {
    RequestItems: {
      [TABLE_NAME]: items,
    },
  };

  await dynamoDBDocumentClient.batchWrite(params).promise();
}
