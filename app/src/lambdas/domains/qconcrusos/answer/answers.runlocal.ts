import dotenv from "dotenv";
import { AnswerService } from "./service/answer.service";

dotenv.config({
  path: "../../.env"
});

async function main() {
  const filter = "institute_ids%5B%5D=5752";

  const service = new AnswerService();
  return service.scrapyAnswer(filter);
}

main();
