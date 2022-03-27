import { logger } from '../../helpers/logger';
import jpackage from '../../helpers/packageInfo';
import Book, { WritableSheetsPages } from './Books';

export default function () {
  return {
    info: () => {
      SpreadsheetApp.getActiveSpreadsheet().toast(
        `Version: ${jpackage.version}`,
        `${jpackage.name.toUpperCase()}`
      );
    },
    books: () => {
      const bookService = new Book();
      const data = bookService.list();

      if (data.error) {
        logger.err('Error on request the list of the Books.');
        return;
      }

      const pageRef = bookService.getPageRef(WritableSheetsPages.BOOK);

      logger.info('Prepare data to write.');
      const books = data.data?.results ?? [];
      const rows = books.map((book) => [book.id, book.title]);

      pageRef
        ?.getRange(1, 1, pageRef.getMaxRows(), pageRef.getMaxColumns())
        .clearContent();
      pageRef?.getRange(1, 1, books?.length, 2).setValues([...rows]);

      logger.info('Finished.');
    },
  };
}
