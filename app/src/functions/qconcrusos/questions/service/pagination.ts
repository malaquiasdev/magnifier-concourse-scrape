import { Page } from "puppeteer";

const CURRENT_PAGE_NUMBER_SELECTOR = "body > div.q-root > main > div.container > nav > div > a.q-current.btn.btn-default";
const NEXT_PAGE_URL_SELECTOR = "body > div.q-root > main > div.container > nav > div > a.q-next.btn.btn-default";

type Pagination = {
  currentPage: string;
  nextPageUrl: string;
}

function normalizeCurrentPage(currentPage:number): string {
  if(currentPage.toString().length <= 1){
    return `0${currentPage}`;
  }
  return String(currentPage);
}

export async function getPagination(page: Page): Promise<Pagination> {
  let currentPage = await page.$eval(CURRENT_PAGE_NUMBER_SELECTOR, (element:any) => element !== null ? element.textContent : "");
  currentPage = normalizeCurrentPage(currentPage);
  const nextPageUrl = await page.$eval(NEXT_PAGE_URL_SELECTOR, (element:any) => element !== null ? element.href : "");
  return { currentPage, nextPageUrl };
}
