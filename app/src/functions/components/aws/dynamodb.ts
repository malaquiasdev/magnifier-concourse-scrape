import AWS from "aws-sdk";
import pino from "pino";

const dynamoDBDocumentClient = new AWS.DynamoDB.DocumentClient();
const unmarshall = data => AWS.DynamoDB.Converter.unmarshall(data);

export async function save(data:any) {
  const params = {
    TableName: "envipro_qconcursos_questions",
    Item: {
      ...data,
    },
  };
  await dynamoDBDocumentClient.put(params).promise();
}

export async function saveBatch(array:any) {
  const items = array.map((data) => {
    return {
      PutRequest: {
        Item: {
         ...data
        }
      }
    }
  });
  var params = {
    RequestItems: {
      "envipro_qconcursos_questions": items,
    }
  };

  await dynamoDBDocumentClient.batchWrite(params).promise();
}