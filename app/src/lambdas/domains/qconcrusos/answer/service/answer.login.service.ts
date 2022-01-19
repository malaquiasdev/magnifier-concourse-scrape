import { Page } from "puppeteer";
import { Logger } from "pino";
import { LoginForm } from "./login";
import {
  LOGIN_EMAIL_INPUT_FORM,
  LOGIN_PASSWORD_INPUT_FORM,
  LOGIN_FORM,
  USER_PROFILE_AFTER_LOGIN
} from "./answer.selectors";

export class AnswerLoginService {
  private url: string;
  private logger: Logger;

  constructor(logger: Logger) {
    this.url = "https://www.qconcursos.com/conta/entrar";
    this.logger = logger;
  }

  public async login(page: Page, login: LoginForm): Promise<Page> {
    try {
      await page.goto(this.url);
      await page.type(LOGIN_EMAIL_INPUT_FORM, login.email, { delay: 300 });
      await page.type(LOGIN_PASSWORD_INPUT_FORM, login.password, {
        delay: 300
      });
      await page.waitForTimeout(1500);
      const form = await page.$(LOGIN_FORM);
      await form.evaluate((form: any) => form.submit());
      await page.waitForSelector(USER_PROFILE_AFTER_LOGIN);
      return page;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
