import { Page } from 'puppeteer';
import { Pagination } from '@qconcursos/types/pagination';
import { QuestionSelectors } from '@qconcursos/enums/question.selectors';

export class QuestionPaginationService {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  public async scrapyPagination(baseUrl: string): Promise<Pagination> {
    const data = await this.page.evaluate(
      (currentPageNumberSelector: string, nextPageUrlSelector: string) => {
        const currentPageElement = document.querySelector(currentPageNumberSelector);
        const nextPageUrlElement = document.querySelector(nextPageUrlSelector);
        const currentPage = currentPageElement !== null ? currentPageElement.textContent : '';
        const nextPageUrl = nextPageUrlElement !== null ? nextPageUrlElement.getAttribute('href') : '';
        return { currentPage, nextPageUrl };
      },
      QuestionSelectors.CURRENT_PAGE_NUMBER_SELECTOR,
      QuestionSelectors.NEXT_PAGE_URL_SELECTOR,
    );

    return {
      currentPage: this.normalizeCurrentPage(data.currentPage),
      nextPageUrl: baseUrl.concat(data.nextPageUrl),
    };
  }

  private normalizeCurrentPage(currentPage: string): string {
    if (currentPage.length <= 1) {
      return `0${currentPage}`;
    }
    return String(currentPage);
  }
}
