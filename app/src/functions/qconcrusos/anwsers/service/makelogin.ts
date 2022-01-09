require("dotenv").config();
import pino from "pino";
import { Page } from "puppeteer";

const logger = pino();

export async function makeLogin(page: Page): Promise<Page> {
  try {
    await page.goto("https://www.qconcursos.com/conta/entrar");
    await page.type("#login_email", process.env.QCONCURSOS_LOGIN_EMAIL, {
      delay: 300
    });
    await page.type("#login_password", process.env.QCONCURSOS_LOGIN_PASSWORD, {
      delay: 300
    });
    await page.waitForTimeout(1500);
    const form = await page.$("#login_form");
    await form.evaluate((form: any) => form.submit());
    await page.waitForSelector("#js-current-user");
    return page;
  } catch (error) {
    logger.error(error);
    throw error;
  }
}
