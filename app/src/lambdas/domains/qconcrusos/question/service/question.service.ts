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

export class QuestionService {
  private db: Database;
  private logger: Logger;
  private context: Context;
  private baseUrl: string;
  private questionAudity: QuestionAudity;
  private questionEntity: QuestionEntity;

  constructor(context: Context) {
    this.db = new Database();
    this.logger = pino();
    this.context = context;
    this.baseUrl = "https://www.qconcursos.com";
    this.questionAudity = new QuestionAudity(this.db, this.logger);
    this.questionEntity = new QuestionEntity(this.db);
  }

  public async main({ url, mails }: EntryPointInput): Promise<Question[]> {
    this.logger.info(`Going to page - ${url}`);
    const browser = await ChromiumBrowser.create();
    try {
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: "networkidle0" });
      const pagination = await new QuestionPaginationService(
        page
      ).getPagination(this.baseUrl);
      this.logger.info(pagination);
      await this.questionAudity.audityFunction(
        { url, mails },
        this.main.name,
        this.context
      );
      const questionScrapyListService = new QuestionScrapyListService(
        page,
        this.db
      );
      const questions = await questionScrapyListService.scrapyQuestions(url);
      if (Array.isArray(questions) && questions.length > 0) {
        await this.questionEntity.batchPersist(questions);
      } else {
        throw Error("Questions not found");
      }
      await browser.close();
      return questions;
    } catch (error) {
      await browser.close();
      this.logger.error(error);
      throw error;
    }
  }
}
