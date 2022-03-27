import HttpManager from '../../core/HttpManager';
import Service, { ServiceType } from '../../core/Service';

type BookType = {
  id: number;
  title: string;
};

type ListBookResponse = {
  results: BookType[];
};

export enum WritableSheetsPages {
  BOOK = 'Books',
}

class Book extends Service<ServiceType<WritableSheetsPages>> {
  constructor() {
    super({
      base_url: 'https://gutendex.com',
      writablePages: [WritableSheetsPages.BOOK],
    });
  }

  public list() {
    return HttpManager.get<ListBookResponse>(this.getBaseURL(), '/:example', {
      urlParams: {
        example: 'books',
      },
      queryString: {
        languages: 'en,fr,br',
      },
    });
  }
}

export default Book;
