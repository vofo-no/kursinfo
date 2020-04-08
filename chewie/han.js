const HRS = 23;
const [M1, M2, M3, M4, M5, M6] = [7, 8, 9, 10, 11, 12];
const [F1, F2, F3, F4, F5, F6] = [13, 14, 15, 16, 17, 18];
const [FM, FF] = [19, 20];
const LA = 0;
const ORG = 1;
const SBJ = 4;

const sumHours = (rows) => rows.reduce((acc, row) => acc + row[HRS], 0);

const sumMales = (rows) =>
  rows.reduce(
    (acc, row) =>
      acc + row[M1] + row[M2] + row[M3] + row[M4] + row[M5] + row[M6],
    0
  );
const sumFemales = (rows) =>
  rows.reduce(
    (acc, row) =>
      acc + row[F1] + row[F2] + row[F3] + row[F4] + row[F5] + row[F6],
    0
  );

const sumAges = (rows) => [
  rows.reduce((acc, row) => acc + row[M1] + row[F1], 0),
  rows.reduce((acc, row) => acc + row[M2] + row[F2], 0),
  rows.reduce((acc, row) => acc + row[M3] + row[F3], 0),
  rows.reduce((acc, row) => acc + row[M4] + row[F4], 0),
  rows.reduce((acc, row) => acc + row[M5] + row[F5], 0),
  rows.reduce((acc, row) => acc + row[M6] + row[F6], 0),
];

const participants = (rows, rich = false) => ({
  males: sumMales(rows),
  females: sumFemales(rows),
  ages: rich ? sumAges(rows) : undefined,
});

const facilitated = (rows) => {
  const fData = rows.filter((row) => row[FM] || row[FF]);
  return {
    courses: fData.length,
    hours: sumHours(fData),
    participants: participants(fData),
  };
};

const getMainSubjects = (rows) => [
  ...new Set(rows.map((row) => Math.floor(row[SBJ] / 100))),
];
const mainSubjectSums = (rows) =>
  getMainSubjects(rows).reduce((obj, key) => {
    const sData = rows.filter((row) => Math.floor(row[SBJ] / 100) === key);
    obj[key] = {
      participants: participants(sData),
    };
    return obj;
  }, {});

const countOrganizations = (rows) =>
  new Set(rows.map((row) => `${row[LA]}:${row[ORG]}`)).size;

const associationSummer = (rows) => (assoc) => {
  const aData = rows.filter((row) => row[LA] === assoc);
  return {
    courses: aData.length,
    participants: participants(aData),
    hours: sumHours(aData),
    facilitated: facilitated(aData),
  };
};

module.exports = {
  sumHours,
  participants,
  facilitated,
  countOrganizations,
  associationSummer,
  mainSubjectSums,
};
