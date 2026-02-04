export const COL = {
  ASSOCIATION: 0,
  ORGANIZATION: 1,
  MUNICIPALITY: 2,
  ID: 3,
  SUBJECT: 4,
  MALES: [7, 8, 9, 10, 11, 12],
  FEMALES: [13, 14, 15, 16, 17, 18],
  MALES_FACILITATED: 19,
  FEMALES_FACILITATED: 20,
  HOURS: 23,
};

const sumCols = (rows: number[][], ...cols: number[]): number =>
  rows.reduce(
    (acc, row) => acc + cols.reduce((acc2, col) => acc2 + (row[col] || 0), 0),
    0,
  );

export const sumParticipants = (rows: number[][]) =>
  sumCols(rows, ...COL.MALES, ...COL.FEMALES);
