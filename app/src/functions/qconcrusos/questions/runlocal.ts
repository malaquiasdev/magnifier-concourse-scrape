import { handler } from "./index";

process.env["TABLE_NAME"] = "magnifier-concourse-scrape-questions";

const event = {
  "pathParameters": {
    "url": "https://www.qconcursos.com/questoes-de-concursos/questoes?institute_ids%5B%5D=20&knowledge_area_ids%5B%5D=10&page=2",
  },
  "Records": [
    {
        "EventSource": "aws:sns",
        "EventVersion": "1.0",
        "EventSubscriptionArn": "arn:aws:sns:sa-east-1:11111:test:67d2b442-ef5c-4e22-b1a5-3e18ef25e664",
        "Sns": {
            "Type": "Notification",
            "MessageId": "67d2b442-ef5c-4e22-b1a5-3e18ef25e664",
            "TopicArn": "arn:aws:sns:sa-east-1:11111:test",
            "Subject": null,
            "Message": "https://www.qconcursos.com/questoes-de-concursos/questoes?institute_ids%5B%5D=20&knowledge_area_ids%5B%5D=10&page=38",
            "Timestamp": "2022-01-08T03:44:12.824Z",
            "SignatureVersion": "1",
            "Signature": "",
            "SigningCertUrl": "",
            "UnsubscribeUrl": "",
            "MessageAttributes": {}
        }
    }
]
};

handler(event);
