import pino from "pino";
import { createBrowser } from "../../components/browser";
import { saveBatch } from "../../components/aws/dynamodb";
import { scrapyQuestions } from "./scrapy-questions";
import { getPagination } from "./get-pagination";

const logger = pino();

async function main(event): Promise<string> {
  logger.info(`Going to page - ${event.pathParameters.url}`);
  let nextPage = null;
  const browser = await createBrowser();
  try {
    const page = await browser.newPage();
    await page.goto(event.pathParameters.url, { waitUntil: "networkidle0" });

    const { currentPage, nextPageUrl } = await getPagination(page);
    nextPage = nextPageUrl;

    logger.info(`currentPage - ${currentPage}`);
    logger.info(`nextPageUrl - ${nextPageUrl}`);

    const questions = await scrapyQuestions(page);
    logger.info(questions);

    if (questions && questions.length > 0) {
      await saveBatch(questions);
    } else {
      throw Error("Questions not found");
    }

    while (nextPage) {
      await page.waitForTimeout((Math.floor(Math.random() * 14) + 7) * 1000);
      
      await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
          var totalHeight = 0;
          var distance = 100;
          var timer = setInterval(() => {
            var scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;

            if (totalHeight >= scrollHeight) {
              clearInterval(timer);
              resolve(totalHeight);
            }
          }, 100);
        });
      });

      await page.click(
        "body > div.q-root > main > div.container > nav > div > a.q-next.btn.btn-default"
      );
      await page.waitForSelector(
        "body > div.q-root > main > div.container > div.q-questions-list.js-questions-list > div"
      );

      const { currentPage, nextPageUrl } = await getPagination(page);
      nextPage = nextPageUrl;

      logger.info(`nextPage - ${nextPage}`);

      const questions = await scrapyQuestions(page);
      logger.info(questions);

      if (questions && questions.length > 0) {
        await saveBatch(questions);
      } else {
        throw Error("Questions not found");
      }
    }

    await browser.close();
    return "done";
  } catch (error) {
    logger.error(error);
    await browser.close();
    return nextPage;
  }
}

export async function handler(event): Promise<string> {
  return main(event);
}