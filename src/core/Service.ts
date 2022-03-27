import { logger } from '../helpers/logger';
import { ArrayType, PropType } from './types';

export type ServiceType<P = string> = {
  base_url: string;
  writablePages?: P[];
};

class Service<T extends ServiceType> {
  private base_url: string;
  private writablePages: string[];

  constructor({ base_url, writablePages }: T) {
    this.base_url = base_url;
    this.writablePages = writablePages ?? [];
  }

  public getBaseURL() {
    return this.base_url;
  }

  public getWritablePages() {
    return this.writablePages;
  }

  public getPageRef(
    value?: ArrayType<PropType<Pick<T, 'writablePages'>, 'writablePages'>>
  ): GoogleAppsScript.Spreadsheet.Sheet | null {
    if (!this.writablePages.length) {
      logger.info('"writablePages" is empty.');
      return null;
    }

    const page = value ?? this.writablePages[0];

    logger.debug(`Trying to get page reference with the name: ${page}`);
    const ref = SpreadsheetApp.getActive().getSheetByName(page);

    if (!ref) {
      logger.err(`Page reference with the name ${page} is empty`);
    }

    return ref;
  }
}

export default Service;
