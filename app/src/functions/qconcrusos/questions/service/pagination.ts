import { Page } from "puppeteer";

const CURRENT_PAGE_NUMBER_SELECTOR = "body > div.q-root > main > div.container > nav > div > a.q-current.btn.btn-default";
const NEXT_PAGE_URL_SELECTOR = "body > div.q-root > main > div.container > nav > div > a.q-next.btn.btn-default";

export type Pagination = {
  currentPage: string;
  nextPageUrl: string;
}

function normalizeCurrentPage(currentPage:string): string {
  if(currentPage.length <= 1){
    return `0${currentPage}`;
  }
  return String(currentPage);
}

export async function getPagination(page: Page): Promise<Pagination> {
  const data = await page.evaluate((currentPageNumberSelector: string, nextPageUrlSelector: string) => {
    const currentPageElement = document.querySelector(currentPageNumberSelector);
    const nextPageUrlElement = document.querySelector(nextPageUrlSelector);
    const currentPage = currentPageElement !== null ? currentPageElement.textContent : "";
    const nextPageUrl = nextPageUrlElement !== null ? nextPageUrlElement.getAttribute("href") : "";

    return { currentPage, nextPageUrl };
  }, CURRENT_PAGE_NUMBER_SELECTOR, NEXT_PAGE_URL_SELECTOR);

  return {
    currentPage: normalizeCurrentPage(data.currentPage),
    nextPageUrl: data.nextPageUrl
  }
}
