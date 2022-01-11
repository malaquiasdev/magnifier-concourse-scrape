import dotenv from "dotenv";
import { Context } from "aws-lambda";
import { QuestionService } from "./service/question.service";
import { EntryPointInput } from "../entrypoint/types/entrypoint.input";

dotenv.config({
  path: "../../.env"
});

async function questionServiceLocal() {
  const context: Context = {
    callbackWaitsForEmptyEventLoop: false,
    functionName: "questionServiceLocal",
    functionVersion: "",
    invokedFunctionArn: "",
    memoryLimitInMB: "",
    awsRequestId: "9439989f-7543-11e6-8dda-150c09a55dc2",
    logGroupName: "",
    logStreamName: "",
    getRemainingTimeInMillis: function (): number {
      throw new Error("Function not implemented.");
    },
    done: function (error?: Error, result?: any): void {
      throw new Error("Function not implemented.");
    },
    fail: function (error: string | Error): void {
      throw new Error("Function not implemented.");
    },
    succeed: function (messageOrObject: any): void {
      throw new Error("Function not implemented.");
    }
  };

  const input: EntryPointInput = {
    url: "https://www.qconcursos.com/questoes-de-concursos/questoes?institute_ids%5B%5D=20&knowledge_area_ids%5B%5D=10&page=2",
    mails: ["x.aaa@gmail.com"]
  };

  const service = new QuestionService(context);
  return service.main(input);
}

questionServiceLocal();
