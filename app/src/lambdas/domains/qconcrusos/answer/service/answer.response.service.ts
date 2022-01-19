import { Page } from "puppeteer";
import { Question } from "../../entities/types/question";
import {
  ANSWER_ALTERNATIVE_PREFIX,
  USER_PROFILE_AFTER_LOGIN,
  ANSWER_BUTTON,
  RIGHT_ANSWER_TEXT
} from "./answer.selectors";

export class AnswerResponseService {
  private page: Page;

  constructor(loggedPage: Page) {
    this.page = loggedPage;
  }

  public async scrapyAnswers(question: any): Promise<Question> {
    await this.page.goto(question.url);

    await this.page.evaluate(
      (questionId: number, ANSWER_ALTERNATIVE_PREFIX: string) => {
        var alternative = document.getElementsByName(
          `${ANSWER_ALTERNATIVE_PREFIX}-${questionId}`
        )[0];
        alternative.click();
      },
      question.id,
      ANSWER_ALTERNATIVE_PREFIX
    );

    await this.page.waitForSelector(USER_PROFILE_AFTER_LOGIN);
    await this.page.waitForTimeout(500);
    await this.page.click(ANSWER_BUTTON);
    await this.page.waitForTimeout((Math.floor(Math.random() * 12) + 7) * 1000);

    const correctAnswer = await this.page.evaluate(
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
      question.id,
      RIGHT_ANSWER_TEXT,
      ANSWER_ALTERNATIVE_PREFIX
    );

    return correctAnswer;
  }
}
