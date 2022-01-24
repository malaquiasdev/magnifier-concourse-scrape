export enum QuestionSelectors {
  CURRENT_PAGE_NUMBER_SELECTOR = 'body > div.q-root > main > div.container > nav > div > a.q-current.btn.btn-default',
  NEXT_PAGE_URL_SELECTOR = 'body > div.q-root > main > div.container > nav > div > a.q-next.btn.btn-default',
  LIST_SELECTORS = 'body > div.q-root > main > div.container > div.q-questions-list.js-questions-list > div',
  HEADER_REF_SELECTOR = 'div.q-question-header > div.q-ref > div > a',
  HEADER_SUBJECT_SELECTOR = 'div.q-question-header > div.q-question-breadcrumb > a',
  HEADER_INFO_SELECTOR = 'div.js-question.q-question > div.q-question-info > span',
  BODY_ENUNCIATION_SELECTOR = 'div.js-question.q-question > div.q-question-body > div.q-question-enunciation',
  BODY_ENUNCIATION_IMG_SELECTOR = 'div.js-question.q-question > div.q-question-body > div.q-question-enunciation > img',
  ALTERNATIVE_SELECTOR = 'span.q-option-item',
  ALTERNATIVE_CONTENT_SELECTOR = 'div.q-item-enum.js-alternative-content',
}
