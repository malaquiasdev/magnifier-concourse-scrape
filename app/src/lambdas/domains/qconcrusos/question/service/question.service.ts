import pino, { Logger } from "pino";
import { Context } from "aws-lambda";
import { Database } from "../../../../aws/database";
import { ChromiumBrowser } from "../../../../utils/chromium.browser";
import { QuestionPaginationService } from "./question.pagination.service";
import { QuestionAudity } from "./question.adutiy.service";
import { EntryPointInput } from "../../entrypoint/types/entrypoint.input";
import { QuestionScrapyListService } from "./question.scrapy.list.service";
import { Question } from "../../entities/types/question";
import { QuestionEntity } from "../../entities/question.entity";
import { Page } from "puppeteer";

export class QuestionService {
  private db: Database;
  private logger: Logger;
  private context: Context;
  private baseUrl: string;
  private questionAudity: QuestionAudity;
  private questionEntity: QuestionEntity;
  private nextUrl: string;

  constructor(context: Context) {
    this.db = new Database();
    this.logger = pino();
    this.context = context;
    this.baseUrl = "https://www.qconcursos.com";
    this.questionAudity = new QuestionAudity(this.db, this.logger);
    this.questionEntity = new QuestionEntity(this.db);
  }

  public async main(body: EntryPointInput): Promise<Question[]> {
    this.logger.info(body);
    this.logger.info(`Going to page - ${body["url"]}`);
    const browser = await ChromiumBrowser.create();
    try {
      const page = await browser.newPage();
      await page.goto(body.url, { waitUntil: "networkidle0" });
      const pagination = await new QuestionPaginationService(
        page
      ).getPagination(this.baseUrl);
      this.nextUrl = pagination.nextPageUrl;
      this.logger.info(pagination);
      await this.questionAudity.audityFunction(
        body,
        this.main.name,
        this.context
      );
      const questionScrapyListService = new QuestionScrapyListService(page);
      const questions = await questionScrapyListService.scrapyQuestions(
        body.url
      );
      if (Array.isArray(questions) && questions.length > 0) {
        await this.questionEntity.batchPersist(questions);
      } else {
        throw Error("Questions not found");
      }
      await this.scrapyMoreQuestions(
        page,
        questionScrapyListService,
        body.url,
        pagination.nextPageUrl
      );
      await browser.close();
      return questions;
    } catch (error) {
      await browser.close();
      this.logger.error(error);
      throw error;
    }
  }

  private async scrapyMoreQuestions(
    page: Page,
    questionScrapyListService: QuestionScrapyListService,
    url: string,
    nextPageUrl: string
  ): Promise<void> {
    do {
      this.logger.info(`Going to next page - ${nextPageUrl}`);

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

      const pagination = await new QuestionPaginationService(
        page
      ).getPagination(this.baseUrl);
      this.nextUrl = pagination.nextPageUrl;

      const questions = await questionScrapyListService.scrapyQuestions(url);
      if (Array.isArray(questions) && questions.length > 0) {
        await this.questionEntity.batchPersist(questions);
      } else {
        throw Error("Questions not found");
      }
    } while (this.nextUrl);
  }

  public async setTimout(): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`estou dentro do timeout: ${this.nextUrl}`);
        resolve({ statusCode: 200, message: "Sorry, your task timed out!" });
      }, 2.9 * 60 * 1000);
    });
  }
}
