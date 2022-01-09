import pino from "pino";
import {
  getQuestionsWithNullAnswer,
  save
} from "../../../components/aws/dynamodb";
import { normalize } from "../../../components/aws/event";
import { createBrowser } from "../../../components/browser";
import { makeLogin } from "./makelogin";
import { scrappyAnswers } from "./scrappyanswers";

const logger = pino();

export async function main(event) {
  logger.info(event);
  const browser = await createBrowser();
  try {
    const questions = await getQuestionsWithNullAnswer(event.body.filter);
    const page = await browser.newPage();
    const pageLogged = await makeLogin(page);
    logger.info(questions.length);
    for (const item of questions) {
      const answer = await scrappyAnswers(
        pageLogged,
        item.questionURL,
        item.questionId
      );
      item.answer = answer;
      await save(item);
    }
    await browser.close();
    return "done";
  } catch (error) {
    logger.error(error);
    await browser.close();
    throw error;
  }
}
