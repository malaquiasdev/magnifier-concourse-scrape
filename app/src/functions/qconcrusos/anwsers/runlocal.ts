import { handler } from "./index";

const event = {
  level: 30,
  time: 1641659800389,
  pid: 9,
  hostname: "169.254.61.61",
  version: "2.0",
  routeKey: "POST /v1/qconcursos/questions",
  rawPath: "/v1/qconcursos/questions",
  rawQueryString: "",
  headers: {
    accept: "*/*",
    "accept-encoding": "gzip, deflate, br",
    "content-length": "179",
    "content-type": "application/json",
    host: "",
    "postman-token": "bde5a778-6325-4a34-8496-b78bed5736ba",
    "user-agent": "PostmanRuntime/7.28.4",
    "x-amzn-trace-id": "Root=1-61d9bd96-775538a14a8338ce7be12eb7",
    "x-forwarded-for": "127.0.0.7",
    "x-forwarded-port": "443",
    "x-forwarded-proto": "https"
  },
  requestContext: {
    accountId: "",
    apiId: "",
    domainName: "",
    domainPrefix: "",
    http: {
      method: "POST",
      path: "/v1/qconcursos/questions",
      protocol: "HTTP/1.1",
      sourceIp: "189.120.74.36",
      userAgent: "PostmanRuntime/7.28.4"
    },
    requestId: "LoqPlg4lmjQEMog=",
    routeKey: "POST /v1/qconcursos/questions",
    stage: "$default",
    time: "08/Jan/2022:16:36:38 +0000",
    timeEpoch: 1641659798790
  },
  body: { filter: "institute_ids%5B%5D=20&knowledge_area_ids%5B%5D=10" },
  isBase64Encoded: false
};

handler(event);
