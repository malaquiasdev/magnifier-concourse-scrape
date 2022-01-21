export const CURRENT_PAGE_NUMBER_SELECTOR: string =
  "body > div.q-root > main > div.container > nav > div > a.q-current.btn.btn-default";

export const NEXT_PAGE_URL_SELECTOR: string =
  "body > div.q-root > main > div.container > nav > div > a.q-next.btn.btn-default";

export const QUESTIONS_LIST_SELECTORS = {
  LIST_SELECTORS:
    "body > div.q-root > main > div.container > div.q-questions-list.js-questions-list > div",
  HEADER: {
    REF_SELECTOR: "div.q-question-header > div.q-ref > div > a",
    SUBJECT_SELECTOR: "div.q-question-header > div.q-question-breadcrumb > a"
  }
};
