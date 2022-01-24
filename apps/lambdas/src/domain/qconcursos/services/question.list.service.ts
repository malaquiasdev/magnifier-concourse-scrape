import { Page } from 'puppeteer';
import { Question, Header, Info, Body } from '@qconcursos/types/question';
import { QuestionSelectors } from '@qconcursos/enums/question.selectors';

export class QuestionListService {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  public async scrapyQuestions(url: string): Promise<Question[]> {
    return this.page.evaluate(
      (
        url: string,
        LIST_SELECTORS: string,
        HEADER_REF_SELECTOR: string,
        HEADER_SUBJECT_SELECTOR: string,
        HEADER_INFO_SELECTOR: string,
        BODY_ENUNCIATION_SELECTOR: string,
        BODY_ENUNCIATION_IMG_SELECTOR: string,
      ) => {
        const result = [];
        const filter: string = url.split('?')[1].split('&page')[0];
        document.querySelectorAll(LIST_SELECTORS).forEach((e: Element) => {
          const refElement = e.querySelector(HEADER_REF_SELECTOR);
          const subjectElement = e.querySelector(HEADER_SUBJECT_SELECTOR);

          const header: Header = {
            id: refElement !== null ? refElement.textContent.split('Q')[1].trim() : null,
            url: refElement !== null ? refElement.getAttribute('href') : '',
            subjectUrl: subjectElement !== null ? subjectElement.getAttribute('href') : '',
            subjectName: subjectElement !== null ? subjectElement.textContent.split('\n')[1].trim().toLowerCase() : '',
          };

          const info: Info = {
            year: null,
            juryName: null,
            juryUrl: null,
            organName: null,
            organUrl: null,
            examName: null,
            examUrl: null,
          };

          e.querySelectorAll(HEADER_INFO_SELECTOR).forEach((el: any) => {
            if (el && el.innerText.toLowerCase().includes('ano')) {
              info.year = el.textContent.split(':')[1].trim();
            }
            if (el && el.innerText.toLowerCase().includes('banca')) {
              info.juryUrl = el.childNodes[3].href;
              info.juryName = el.childNodes[3].text;
            }
            if (el && el.innerText.toLowerCase().includes('órgão')) {
              info.organUrl = el.childNodes[3].href;
              info.organName = el.childNodes[3].text;
            }
            if (el && el.innerText.toLowerCase().includes('prova')) {
              info.examUrl = el.childNodes[3].href;
              info.examName = el.childNodes[3].text.replace('/', '-').replace(/\s/g, '');
            }
          });

          const body: Body = {
            enunciation: {
              image: '',
              description: '',
            },
            alternatives: [],
            answer: null,
          };

          const enunciationElement = e.querySelector(BODY_ENUNCIATION_SELECTOR);

          const enunciationImageElement = e.querySelector(BODY_ENUNCIATION_IMG_SELECTOR);

          body.enunciation.description = enunciationElement !== null ? enunciationElement.textContent.replace('\n', '') : '';
          body.enunciation.image = enunciationImageElement !== null ? enunciationImageElement.getAttribute('src') : '';

          const alternativeIds = Array.from(e.querySelectorAll('span.q-option-item')).map((el: any) => el.innerText);

          const alternativeContents = Array.from(e.querySelectorAll('div.q-item-enum.js-alternative-content')).map((el: any) => {
            const imgAlternativeElement = el.querySelector('p > img');
            return imgAlternativeElement !== null ? imgAlternativeElement.src : el.innerText;
          });

          for (let index = 0; index < alternativeIds.length; index++) {
            const key = alternativeIds[index];
            const value = alternativeContents[index];
            body.alternatives.push({ key, value });
          }

          const deprecatedElement = e.querySelector('div.q-caption > span');

          if (
            (deprecatedElement && deprecatedElement.textContent.toLocaleLowerCase().includes('questão desatualizada')) ||
            (deprecatedElement && deprecatedElement.textContent.toLocaleLowerCase().includes('questão anulada'))
          ) {
            return;
          }
          const question = {
            ...header,
            ...info,
            ...body,
            filter,
          };
          result.push(question);
        });

        return result;
      },
      url,
      QuestionSelectors.LIST_SELECTORS,
      QuestionSelectors.HEADER_REF_SELECTOR,
      QuestionSelectors.HEADER_SUBJECT_SELECTOR,
      QuestionSelectors.HEADER_INFO_SELECTOR,
      QuestionSelectors.BODY_ENUNCIATION_SELECTOR,
      QuestionSelectors.BODY_ENUNCIATION_IMG_SELECTOR,
    );
  }
}