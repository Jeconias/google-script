class Table {
  /**
   * Get all columns from data
   *
   * @param {data} The array with the data returned.
   * @param {initial} The array with the initial columns
   * @return a array.
   */
  public static getColumns(data: { [s: string]: any }[], initial: string[]) {
    if (!Array.isArray(data)) return [];

    return data.reduce(
      (acc, curr) => {
        if (typeof curr !== 'object' || Array.isArray(curr)) return acc;

        const colunms: string[] = [];
        const keys = Object.keys(curr);

        keys.forEach((c) => {
          if (!acc.includes(c)) {
            colunms.push(c);
          }
        });

        return acc.concat(colunms);
      },
      Array.isArray(initial) ? initial : []
    );
  }

  /**
   * Swap array element
   *
   * @param {data} The array with the values.
   * @param {from} The index of the value that goes to another position.
   * @param {to} The index that receives the value.
   * @return a array
   */
  public static swapArrayElement(data: string[], from: number, to: number) {
    if (!Array.isArray(data) || data.length < 2) return data;
    if (typeof from !== 'number' || typeof to !== 'number') return data;
    if (
      from < 0 ||
      from >= data.length ||
      to < 0 ||
      to >= data.length ||
      from === to
    )
      return data;

    const aux = data[to];

    data[to] = data[from];
    data[from] = aux;

    return data;
  }

  /**
   * Find cell by text
   *
   * @param {pageName} The name of page: Ex: Canais Android.
   * @param {text} The text to find.
   * @return a object with column and row if found, otherwise undefined or null if table not exists.
   */
  public static findCellByText(pageName: string, text: string) {
    const ss = SpreadsheetApp.getActive();
    const sheet = ss.getSheetByName(pageName);
    if (!sheet) return null;

    const data = sheet.getDataRange().getValues();

    for (let column = 0; column < data.length; column++) {
      for (let row = 0; row < data[column].length; row++) {
        if (data[column][row] === text)
          return { column: column + 1, row: row + 1 };
      }
    }

    return undefined;
  }

  /**
   * This function changes as positions of the matrix to keep a column always in the same position
   *
   * @param {data} The array reference.
   * @param {columnNames} Array of possible names.
   * @param {columnPosition} The array with column index.
   * @return a array
   */
  public static persistPosition(
    dataRef: string[],
    columnNames: string[],
    columnPositions: number[]
  ) {
    if (
      !Array.isArray(dataRef) ||
      !Array.isArray(columnNames) ||
      !Array.isArray(columnPositions) ||
      columnNames.length !== columnPositions.length
    ) {
      return dataRef;
    }

    const size = columnNames.length;

    for (let i = 0; i < size; i++) {
      const dateColumnIndex = dataRef.findIndex(
        (v) => columnNames[i] === v.toLowerCase()
      );
      if (dateColumnIndex !== -1) {
        dataRef = Table.swapArrayElement(
          dataRef,
          dateColumnIndex,
          columnPositions[i]
        );
      }
    }

    return dataRef;
  }
}

export default Table;
