const COL = {
  ASSOCIATION: 0,
  ORGANIZATION: 1,
  MUNICIPALITY: 2,
  SUBJECT: 4,
  MALES: [7, 8, 9, 10, 11, 12],
  FEMALES: [13, 14, 15, 16, 17, 18],
  MALES_FACILITATED: 19,
  FEMALES_FACILITATED: 20,
  HOURS: 23,
};

const AGEINDEX = [0, 1, 2, 3, 4, 5];

const sumCols = (rows, ...cols) =>
  rows.reduce(
    (acc, row) => acc + cols.reduce((acc2, col) => acc2 + row[col], 0),
    0
  );

const sumHours = (rows) => sumCols(rows, COL.HOURS);
const sumMales = (rows) => sumCols(rows, ...COL.MALES);
const sumFemales = (rows) => sumCols(rows, ...COL.FEMALES);

const sumAges = (rows) =>
  AGEINDEX.map((i) => sumCols(rows, COL.MALES[i], COL.FEMALES[i]));

const participants = (rows, rich = false) => ({
  males: sumMales(rows),
  females: sumFemales(rows),
  ages: rich ? sumAges(rows) : undefined,
});

const facilitated = (rows) => {
  const fData = rows.filter(
    (row) => row[COL.MALES_FACILITATED] || row[COL.FEMALES_FACILITATED]
  );
  return {
    courses: fData.length,
    hours: sumHours(fData),
    participants: participants(fData),
  };
};

const getMainSubjects = (rows) => [
  ...new Set(rows.map((row) => Math.floor(row[COL.SUBJECT] / 100))),
];
const mainSubjectSums = (rows) =>
  getMainSubjects(rows).reduce((obj, key) => {
    const sData = rows.filter(
      (row) => Math.floor(row[COL.SUBJECT] / 100) === key
    );
    obj[key] = {
      participants: participants(sData),
    };
    return obj;
  }, {});

const getSubjects = (rows) => [...new Set(rows.map((row) => row[COL.SUBJECT]))];
const subjectSums = (rows) =>
  getSubjects(rows).reduce((obj, key) => {
    const sData = rows.filter((row) => row[COL.SUBJECT] === key);
    obj[key] = {
      participants: participants(sData, true),
    };
    return obj;
  }, {});

const topAge = (summed, i, limit = 5) =>
  Object.keys(summed)
    .sort(
      (a, b) => summed[b].participants.ages[i] - summed[a].participants.ages[i]
    )
    .slice(0, limit);

const topAges = (summed) => AGEINDEX.map((i) => topAge(summed, i));

const countOrganizations = (rows) =>
  new Set(rows.map((row) => `${row[COL.ASSOCIATION]}:${row[COL.ORGANIZATION]}`))
    .size;

const associationSummer = (rows) => (assoc) => {
  const aData = rows.filter((row) => row[COL.ASSOCIATION] === assoc);
  return {
    courses: aData.length,
    participants: participants(aData),
    hours: sumHours(aData),
    facilitated: facilitated(aData),
  };
};

const municipalitySummer = (rows) => (mun) => {
  const aData = rows.filter((row) => row[COL.MUNICIPALITY] === mun);
  return {
    courses: aData.length,
    participants: participants(aData, false),
    hours: sumHours(aData),
  };
};

module.exports = {
  sumHours,
  participants,
  facilitated,
  countOrganizations,
  associationSummer,
  mainSubjectSums,
  subjectSums,
  municipalitySummer,
  topAges,
};
