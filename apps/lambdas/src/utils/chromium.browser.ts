/* eslint-disable @typescript-eslint/no-empty-function */
import Chromium from 'chrome-aws-lambda';
import { Browser } from 'puppeteer';
import { addExtra } from 'puppeteer-extra';
import pluginStealth from 'puppeteer-extra-plugin-stealth';

export class ChromiumBrowser {
  private constructor() {}

  public static async create(): Promise<Browser> {
    const puppeteerExtra = addExtra(Chromium.puppeteer as any);
    puppeteerExtra.use(pluginStealth());
    const browser = await puppeteerExtra.launch({
      args: Chromium.args,
      defaultViewport: Chromium.defaultViewport,
      executablePath: await Chromium.executablePath,
      headless: Chromium.headless,
    });
    return browser;
  }
}
