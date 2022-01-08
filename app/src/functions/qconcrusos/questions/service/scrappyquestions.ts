import { Page } from "puppeteer";

const QUESTIONS_LIST_SELECTOR =
  "body > div.q-root > main > div.container > div.q-questions-list.js-questions-list > div";

export async function scrappyQuestions(page: Page): Promise<any> {
  return page.evaluate((QUESTIONS_LIST_SELECTOR: string) => {
    const result = [];
    document.querySelectorAll(QUESTIONS_LIST_SELECTOR).forEach((e: Element) => {
      //question headers
      const urlElement = e.querySelector(
        "div.q-question-header > div.q-ref > div > a"
      );
      const idElement = e.querySelector(
        "div.q-question-header > div.q-ref > div > a"
      );
      const subjectUrlElement = e.querySelector(
        "div.q-question-header > div.q-question-breadcrumb > a"
      );
      const subjectNameElement = e.querySelector(
        "div.q-question-header > div.q-question-breadcrumb > a"
      );

      //question infos
      const info = {
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

      //question body
      const body = {
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

      result.push({
        questionURL: urlElement !== null ? urlElement.getAttribute("href") : "",
        questionId:
          idElement !== null
            ? idElement.textContent.split("Q")[1].trim()
            : null,
        subjectURL:
          subjectUrlElement !== null
            ? subjectUrlElement.getAttribute("href")
            : "",
        subjectName:
          subjectNameElement !== null
            ? subjectNameElement
                .getAttribute("text")
                .split("\n")[1]
                .trim()
                .toLowerCase()
            : "",
        ...info,
        ...body
      });
    });
    return result;
  }, QUESTIONS_LIST_SELECTOR);
}
