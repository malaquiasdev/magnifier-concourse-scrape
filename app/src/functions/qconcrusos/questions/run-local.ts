import { handler } from "./index";

//process.env["BUCKET_PATH"] = "enviproglue-jqrts";

const event = {
  "pathParameters": {
    "url": "https://www.qconcursos.com/questoes-de-concursos/questoes?institute_ids%5B%5D=20&knowledge_area_ids%5B%5D=10&page=2",
  },
};

handler(event);