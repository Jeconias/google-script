import { logger } from '../helpers/logger';
import { stringify } from 'qs';
import { replaceParamsByValues } from '../helpers/utils';

type GetHttpManagerResponse<T> = {
  code: number | undefined;
  error?: string;
  data?: T;
};

class HttpManager {
  public static get<T extends any>(
    base: string,
    path: string,
    options?: {
      headers?: GoogleAppsScript.URL_Fetch.HttpHeaders;
      queryString?: object;
      urlParams?: { [s: string]: string };
    }
  ): GetHttpManagerResponse<T> {
    if (typeof path !== 'string')
      return { code: undefined, error: '"path" should be a string.' };

    const pathWithParams = replaceParamsByValues(
      path,
      options?.urlParams ?? {}
    );
    const queryString = stringify(options?.queryString ?? {}, {
      addQueryPrefix: true,
    });

    const request = `${base}${pathWithParams}${queryString}`;
    logger.info(`Requesting: ${request}`);

    const resp = UrlFetchApp.fetch(request, {
      contentType: 'application/json',
      muteHttpExceptions: true,
      headers: options?.headers,
    });

    if (resp.getResponseCode() === 200) {
      logger.info(`Request: ${request} -> Finished with HTTP code 200`);
      return {
        code: 200,
        data: JSON.parse(resp.getContentText()),
      };
    } else {
      logger.err(
        `Request: ${request} -> Finished with HTTP code ${resp.getResponseCode()}`,
        resp.getContentText()
      );
      return {
        code: resp.getResponseCode(),
        error: resp.getContentText(),
      };
    }
  }
}

export default HttpManager;
