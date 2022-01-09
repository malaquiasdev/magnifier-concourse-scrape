export type InputParams = {
  method: string,
  data: any,
  querystring: any,
  pathParameters: any
}

export function normalize(event: any): InputParams {
  return {
    method: event["requestContext"]["http"]["method"],
    data: event["body"] ? JSON.parse(event["body"]) : {},
    querystring: event["queryStringParameters"] || {},
    pathParameters: event["pathParameters"] || {}
  };
}