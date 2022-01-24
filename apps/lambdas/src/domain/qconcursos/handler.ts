import dotenv from 'dotenv';
import { Database } from '@aws/database';
import { EntryPointController } from '@qconcursos/controllers/entrypoint.controller';
import { Context } from 'aws-lambda';

dotenv.config();

export async function entrypointHandler(event: any, context: Context) {
  const controller = new EntryPointController(new Database(), context, process.env.NEXT_LAMBDA_INVOKE);
  return controller.handlerEvent(event);
}
