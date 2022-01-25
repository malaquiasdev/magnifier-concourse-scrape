import { Logger } from 'pino';
import { Page } from 'puppeteer';
import { SQSUtils } from '@aws/sqs';
import { LambdaUtils } from '@aws/lambda';
import { ChromiumBrowser } from '@utils/chromium.browser';
import { QuestionPaginationService } from '@qconcursos/services/question.pagination.service';
import { QuestionListService } from '@qconcursos/services/question.list.service';
import { QuestionEntity } from '@qconcursos/entities/question.entity';
import { Question } from '@qconcursos/types/question';
import { EntryPointInput } from '@qconcursos/types/entrypoint.input';

export class QuestionService {
  private sqs: SQSUtils;
  private logger: Logger;
  private baseUrl: string;
  private questionEntity: QuestionEntity;
  private lambdaUtils: LambdaUtils;
  private nextUrl: string;
  private mails: string[];
  private nextLambdaInvokeName: string;

  constructor(logger: Logger, sqs: SQSUtils, entity: QuestionEntity, nextLambdaName: string) {
    this.logger = logger;
    this.sqs = sqs;
    this.lambdaUtils = new LambdaUtils();
    this.baseUrl = 'https://www.qconcursos.com';
    this.questionEntity = entity;
    this.nextLambdaInvokeName = nextLambdaName;
  }

  public async scrapyQuestions(body: EntryPointInput): Promise<Question[]> {
    this.logger.info(`Going to page - ${body['url']}`);
    this.mails = body.mails;
    const browser = await ChromiumBrowser.create();
    try {
      const page = await browser.newPage();
      await page.goto(body.url, { waitUntil: 'networkidle0' });
      const pagination = await new QuestionPaginationService(page).scrapyPagination(this.baseUrl);
      this.logger.info(pagination);
      const scrapyListService = new QuestionListService(page);
      const questions = await scrapyListService.scrapyQuestions(body.url);
      if (Array.isArray(questions) && questions.length > 0) {
        await this.questionEntity.batchPersist(questions);
      } else {
        throw Error('Questions not found');
      }
      await this.scrapyMoreQuestions(page, scrapyListService, body.url, pagination.nextPageUrl);
      await browser.close();
      await this.lambdaUtils.invokeNextLambda(this.nextLambdaInvokeName, {
        body: questions[0].filter,
      });
      return questions;
    } catch (error) {
      await browser.close();
      this.logger.error(error);
      throw error;
    }
  }

  private async scrapyMoreQuestions(page: Page, scrapyListService: QuestionListService, url: string, nextPageUrl: string): Promise<void> {
    this.nextUrl = nextPageUrl;
    do {
      this.logger.info(`Going to next page - ${this.nextUrl}`);
      await page.waitForTimeout((Math.floor(Math.random() * 12) + 7) * 1000);
      await page.evaluate(async () => {
        await new Promise(resolve => {
          let totalHeight = 0;
          const distance = 100;
          const timer = setInterval(() => {
            const scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;
            if (totalHeight >= scrollHeight) {
              clearInterval(timer);
              resolve(totalHeight);
            }
          }, 100);
        });
      });
      await page.click('body > div.q-root > main > div.container > nav > div > a.q-next.btn.btn-default');
      await page.waitForSelector('body > div.q-root > main > div.container > div.q-questions-list.js-questions-list > div');
      const pagination = await new QuestionPaginationService(page).scrapyPagination(this.baseUrl);
      this.nextUrl = pagination.nextPageUrl;
      const questions = await scrapyListService.scrapyQuestions(url);
      if (Array.isArray(questions) && questions.length > 0) {
        await this.questionEntity.batchPersist(questions);
      } else {
        throw Error('Questions not found');
      }
    } while (this.nextUrl);
  }

  public async startClockTimer(milliseconds: number): Promise<void> {
    const msg = `next page to called after waiting time: ${this.nextUrl}`;
    const msgAttr = {
      url: {
        DataType: 'String',
        StringValue: this.nextUrl,
      },
      mails: {
        DataType: 'String',
        StringValue: JSON.stringify(this.mails),
      },
    };
    this.sqs.registerToRedrive(msg, msgAttr, milliseconds);
  }
}
