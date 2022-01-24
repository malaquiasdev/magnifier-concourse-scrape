import * as path from 'path';
import dotenv from 'dotenv';
import { Database } from '@aws/database';
import { EntryPointController } from '@qconcursos/controllers/entrypoint.controller';
import { Context } from 'aws-lambda';

dotenv.config({
  path: path.resolve(__dirname, '../../../.env'),
});

async function entrypointRunLocal() {
  const event = {
    body: JSON.stringify({
      url: 'https://www.qconcursos.com/questoes-de-concursos/questoes?institute_ids%5B%5D=20&knowledge_area_ids%5B%5D=10&page=38',
      mails: ['x.xxxx@gmail.com'],
    }),
  };

  const context: Context = {
    callbackWaitsForEmptyEventLoop: false,
    functionName: 'entrypointRunLocal',
    functionVersion: '',
    invokedFunctionArn: '',
    memoryLimitInMB: '',
    awsRequestId: '9439989f-7543-11e6-8dda-150c09a55dc2',
    logGroupName: '',
    logStreamName: '',
    getRemainingTimeInMillis: function (): number {
      throw new Error('Function not implemented.');
    },
    done: function (error?: Error, result?: any): void {
      throw new Error('Function not implemented.');
    },
    fail: function (error: string | Error): void {
      throw new Error('Function not implemented.');
    },
    succeed: function (messageOrObject: any): void {
      throw new Error('Function not implemented.');
    },
  };

  const controller = new EntryPointController(new Database(), context, null);
  await controller.handlerEvent(event);
}

entrypointRunLocal();
