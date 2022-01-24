/* eslint-disable @typescript-eslint/no-empty-function */
import pino from 'pino';
import { URL } from 'url';
const logger = pino();

export class Validate {
  private constructor() {}

  public static isUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch (e) {
      logger.error(e);
      return false;
    }
  }
}
