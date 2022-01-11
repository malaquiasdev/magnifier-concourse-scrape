import { EntryPointService } from "./entrypoint.service";
import dotenv from "dotenv";
import { EntryPointInput } from "./types/entrypoint.input";
import { Context } from "aws-lambda";

dotenv.config({
  path: "../../.env"
});

async function entrypointRunLocal() {
  const input: EntryPointInput = {
    url: "https://www.qconcursos.com/questoes-de-concursos/questoes?institute_ids%5B%5D=20&knowledge_area_ids%5B%5D=10&page=38",
    mails: ["mateus.malaquias1@gmail.com"]
  };

  const context: Context = {
    callbackWaitsForEmptyEventLoop: false,
    functionName: "",
    functionVersion: "my-mock-runtime",
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

  const service = new EntryPointService();
  await service.saveEntryPointSate(input, context);
}

entrypointRunLocal();
