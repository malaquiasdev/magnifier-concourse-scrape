import pino from "pino";
import { createBrowser } from "../../../components/browser";
import { saveBatch } from "../../../components/aws/dynamodb";
import { scrappyQuestions } from "./scrappyquestions";
import { getPagination } from "./pagination";
import { normalize } from "../../../components/aws/event";

const logger = pino();

function getFilter(url: string): string {
  return url.split("?")[1];
}

export async function main(event): Promise<any> {
  logger.info(event);
  let nextPage = null;
  const browser = await createBrowser();
  try {
    const { data } = normalize(event);
    logger.info(`Going to page - ${data.url}`);
    const page = await browser.newPage();
    await page.goto(data.url, { waitUntil: "networkidle0" });

    const { currentPage, nextPageUrl } = await getPagination(page);
    nextPage = nextPageUrl;

    logger.info(`currentPage - ${currentPage}`);
    logger.info(`nextPageUrl - ${nextPageUrl}`);

    const questions = await scrappyQuestions(page, getFilter(data.url));
    logger.info(questions);

    if (Array.isArray(questions) && questions.length > 0) {
      await saveBatch(questions);
    } else {
      throw Error("Questions not found");
    }

    while (nextPage) {
      await page.waitForTimeout((Math.floor(Math.random() * 12) + 7) * 1000);

      await page.evaluate(async () => {
        await new Promise((resolve, _) => {
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

      const questions = await scrappyQuestions(page, getFilter(data.url));
      logger.info(questions);

      if (Array.isArray(questions) && questions.length > 0) {
        await saveBatch(questions);
      } else {
        throw Error("Questions not found");
      }
    }

    await browser.close();
    return { body: { filter: getFilter(data.url) } };
  } catch (error) {
    logger.error(error);
    await browser.close();
    return nextPage;
  }
}
