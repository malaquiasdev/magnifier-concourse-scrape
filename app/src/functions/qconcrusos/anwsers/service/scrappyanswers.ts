import { Page } from "puppeteer";

export async function scrappyAnswers(
  pageLogged: Page,
  questionUrl: string,
  questionId: string
) {
  await pageLogged.goto("https://www.qconcursos.com".concat(questionUrl));

  await pageLogged.evaluate((questionId: string) => {
    var alternative = document.getElementsByName(
      `answer-question-${questionId}`
    )[0];
    alternative.click();
  }, questionId);

  await pageLogged.waitForSelector("#js-current-user");
  await pageLogged.waitForTimeout(500);
  await pageLogged.click("button.js-answer-btn.btn.btn-primary");
  await pageLogged.waitForTimeout((Math.floor(Math.random() * 12) + 7) * 1000);

  const correctAnswer = await pageLogged.evaluate((questionId: string) => {
    const rightAnswer = document.querySelector("span.js-question-right-answer");
    if (rightAnswer && rightAnswer.textContent !== "") {
      return rightAnswer.textContent;
    }
    return document
      .getElementsByName(`answer-question-${questionId}`)[0]
      .getAttribute("value");
  }, questionId);

  return correctAnswer;
}
