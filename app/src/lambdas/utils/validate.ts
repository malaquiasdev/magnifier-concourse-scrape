import pino from "pino";
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
