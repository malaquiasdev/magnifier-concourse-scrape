import { Logger } from "pino";
import { Page } from "puppeteer";
import { Database } from "../../../../aws/database";
import { Question, Header } from "../../entities/types/question";
import { QUESTIONS_LIST_SELECTORS } from "./question.selectors";

export class QuestionScrapyListService {
  private page: Page;
  private db: Database;
  private logger: Logger;

  constructor(page: Page, db: Database) {
    this.page = page;
    this.db = db;
  }

  public async scrapyQuestions(url: string): Promise<any> {
    return this.page.evaluate(
      (QUESTIONS_LIST_SELECTORS: any, url: string) => {
        console.log("estou aqui? scrapyQuestions");
        const x = [];
        const result: Question[] = [];
        const filter: string = url.split("?")[1];
        document
          .querySelectorAll(QUESTIONS_LIST_SELECTORS.LIST_SELECTORS)
          .forEach((e: Element) => {
            const refElement = e.querySelector(
              QUESTIONS_LIST_SELECTORS.HEADER.REF_SELECTOR
            );
            const subjectElement = e.querySelector(
              QUESTIONS_LIST_SELECTORS.HEADER.SUBJECT_SELECTOR
            );

            const header: Header = {
              id:
                refElement !== null
                  ? refElement.textContent.split("Q")[1].trim()
                  : null,
              url: refElement !== null ? refElement.getAttribute("href") : "",
              subjectUrl:
                subjectElement !== null
                  ? subjectElement.getAttribute("href")
                  : "",
              subjectName:
                subjectElement !== null
                  ? subjectElement.textContent
                      .split("\n")[1]
                      .trim()
                      .toLowerCase()
                  : ""
            };

            console.log("header", header);
            x.push(header);
          });
        return x;
      },
      QUESTIONS_LIST_SELECTORS,
      url
    );
  }
}
