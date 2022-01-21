import { Page } from "puppeteer";
import {
  ANSWER_ALTERNATIVE_PREFIX,
  USER_PROFILE_AFTER_LOGIN,
  ANSWER_BUTTON,
  RIGHT_ANSWER_TEXT
} from "./answer.selectors";

export class AnswerResponseService {
  constructor() {}

  public async scrapyAnswers(
    loggedPage: Page,
    questionUrl: string,
    questionId: string
  ): Promise<string> {
    await loggedPage.goto("https://www.qconcursos.com".concat(questionUrl));
    await loggedPage.evaluate(
      (questionId: number, ANSWER_ALTERNATIVE_PREFIX: string) => {
        var alternative = document.getElementsByName(
          `${ANSWER_ALTERNATIVE_PREFIX}-${questionId}`
        )[0];
        alternative.click();
      },
      questionId,
      ANSWER_ALTERNATIVE_PREFIX
    );

    await loggedPage.waitForSelector(USER_PROFILE_AFTER_LOGIN);
    await loggedPage.waitForTimeout(500);
    await loggedPage.click(ANSWER_BUTTON);
    await loggedPage.waitForTimeout(
      (Math.floor(Math.random() * 12) + 7) * 1000
    );

    const correctAnswer = await loggedPage.evaluate(
      (
        questionId: number,
        RIGHT_ANSWER_TEXT: string,
        ANSWER_ALTERNATIVE_PREFIX: string
      ) => {
        const rightAnswer = document.querySelector(RIGHT_ANSWER_TEXT);
        if (rightAnswer && rightAnswer.textContent !== "") {
          return rightAnswer.textContent;
        }
        return document
          .getElementsByName(`${ANSWER_ALTERNATIVE_PREFIX}-${questionId}`)[0]
          .getAttribute("value");
      },
      questionId,
      RIGHT_ANSWER_TEXT,
      ANSWER_ALTERNATIVE_PREFIX
    );

    return correctAnswer;
  }
}
