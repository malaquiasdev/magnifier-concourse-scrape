import { Database } from "../../../../aws/database";
import { Logger } from "pino";
import { QuestionEntity } from "../../entities/question.entity";
import pino from "pino";
import { Question } from "../../entities/types/question";
import { ChromiumBrowser } from "../../../../utils/chromium.browser";
import { AnswerLoginService } from "./answer.login.service";
import { LoginForm } from "./login";
import { AnswerResponseService } from "./answer.response.service";
import { SQSUtils } from "../../../../aws/sqs";

export class AnswerService {
  private login: LoginForm;
  private db: Database;
  private logger: Logger;
  private questionEntity: QuestionEntity;
  private loginService: AnswerLoginService;
  private responseService: AnswerResponseService;
  private filter: string;

  constructor() {
    this.db = new Database();
    this.logger = pino();
    this.questionEntity = new QuestionEntity(this.db);
    this.loginService = new AnswerLoginService(this.logger);
    this.responseService = new AnswerResponseService();
    this.login = {
      email: process.env.QCONCURSOS_LOGIN_EMAIL,
      password: process.env.QCONCURSOS_LOGIN_PASSWORD
    };
  }

  public async scrapyAnswer(questionFilter: string): Promise<Question[]> {
    this.logger.info(`Starting get answers - ${questionFilter}`);
    this.filter = questionFilter;
    const browser = await ChromiumBrowser.create();
    try {
      const questions = await this.questionEntity.findByFilterAndAnswerNull(
        this.filter
      );
      this.logger.info(`Quantity questions: ${questions.length}`);
      const page = await browser.newPage();
      const loggedPage = await this.loginService.login(page, this.login);
      for (const item of questions) {
        const correctAnswer = await this.responseService.scrapyAnswers(
          loggedPage,
          item.url,
          item.id
        );
        item.answer = correctAnswer;
        await this.questionEntity.persist(item);
      }
      return questions;
    } catch (error) {
      this.logger.error(error);
      throw error;
    } finally {
      //await browser.close();
    }
  }

  public async startClockTimer(
    milliseconds: number,
    message: string,
    sqs: SQSUtils
  ): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(async () => {
        this.logger.info(message);
        const item = await sqs.sendMessage(message, {
          filter: {
            DataType: "String",
            StringValue: this.filter
          }
        });
        this.logger.info(item);
        resolve();
      }, milliseconds);
    });
  }
}
