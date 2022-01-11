import { Logger } from "pino";
import { Page } from "puppeteer";
import { Database } from "../../../../aws/database";
import { Question, Header, Info, Body } from "../../entities/types/question";
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

            const info: Info = {
              year: null,
              juryName: null,
              juryUrl: null,
              organName: null,
              organUrl: null,
              examName: null,
              examUrl: null
            };

            e.querySelectorAll(
              "div.js-question.q-question > div.q-question-info > span"
            ).forEach((el: any) => {
              if (el && el.innerText.toLowerCase().includes("ano")) {
                info.year = el.textContent.split(":")[1].trim();
              }
              if (el && el.innerText.toLowerCase().includes("banca")) {
                info.juryUrl = el.childNodes[3].href;
                info.juryName = el.childNodes[3].text;
              }
              if (el && el.innerText.toLowerCase().includes("órgão")) {
                info.organUrl = el.childNodes[3].href;
                info.organName = el.childNodes[3].text;
              }
              if (el && el.innerText.toLowerCase().includes("prova")) {
                info.examUrl = el.childNodes[3].href;
                info.examName = el.childNodes[3].text
                  .replace("/", "-")
                  .replace(/\s/g, "");
              }
            });

            const body: Body = {
              enunciation: {
                image: "",
                description: ""
              },
              alternatives: [],
              answer: null
            };

            const enunciationElement = e.querySelector(
              "div.js-question.q-question > div.q-question-body > div.q-question-enunciation"
            );

            const enunciationImageElement = e.querySelector(
              "div.js-question.q-question > div.q-question-body > div.q-question-enunciation > img"
            );

            body.enunciation.description =
              enunciationElement !== null
                ? enunciationElement.textContent.replace("\n", "")
                : "";
            body.enunciation.image =
              enunciationImageElement !== null
                ? enunciationImageElement.getAttribute("src")
                : "";

            const alternativeIds = Array.from(
              e.querySelectorAll("span.q-option-item")
            ).map((el: any) => el.innerText);

            const alternativeContents = Array.from(
              e.querySelectorAll("div.q-item-enum.js-alternative-content")
            ).map((el: any) => {
              const imgAlternativeElement = el.querySelector("p > img");
              return imgAlternativeElement !== null
                ? imgAlternativeElement.src
                : el.innerText;
            });

            for (let index = 0; index < alternativeIds.length; index++) {
              const key = alternativeIds[index];
              const value = alternativeContents[index];
              body.alternatives.push({ key, value });
            }

            const deprecatedElement = e.querySelector("div.q-caption > span");

            if (
              (deprecatedElement &&
                deprecatedElement.textContent
                  .toLocaleLowerCase()
                  .includes("questão desatualizada")) ||
              (deprecatedElement &&
                deprecatedElement.textContent
                  .toLocaleLowerCase()
                  .includes("questão anulada"))
            ) {
              return;
            }
            const question = {
              ...header,
              ...info,
              ...body,
              filter
            };
            result.push(question);
          });

        return result;
      },
      QUESTIONS_LIST_SELECTORS,
      url
    );
  }
}
