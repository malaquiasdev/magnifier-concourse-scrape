import dotenv from 'dotenv';
import { Database } from '@aws/database';
import { EntryPointController } from '@qconcursos/controllers/entrypoint.controller';
import { QuestionController } from '@qconcursos/controllers/question.controller';
import { Context, APIGatewayProxyResult } from 'aws-lambda';

dotenv.config();

export async function entrypointHandler(event: any, context: Context): Promise<APIGatewayProxyResult> {
  const controller = new EntryPointController(new Database(), context, process.env.NEXT_LAMBDA_INVOKE);
  return controller.handlerEvent(event);
}

export async function questionHandler(event: any, context: Context): Promise<APIGatewayProxyResult> {
  const controller = new QuestionController(process.env.NEXT_LAMBDA_INVOKE);
  return controller.handlerQuestionEvent(event, context);
}
