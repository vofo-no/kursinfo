const COL = {
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

const associationFilter = (val) => (row) => row[COL.ASSOCIATION] === val;
const organizationFilter = (val) => (row) => row[COL.ORGANIZATION] === val;

const sumCols = (rows, ...cols) =>
  rows.reduce(
    (acc, row) => acc + cols.reduce((acc2, col) => acc2 + row[col], 0),
    0
  );

const sumHours = (rows) => sumCols(rows, COL.HOURS);
const sumMales = (rows) => sumCols(rows, ...COL.MALES);
const sumFemales = (rows) => sumCols(rows, ...COL.FEMALES);
const sumParticipants = (rows) => sumCols(rows, ...COL.MALES, ...COL.FEMALES);

const sumAges = (rows) => [
  sumCols(rows, COL.MALES[0], COL.FEMALES[0]),
  sumCols(rows, COL.MALES[1], COL.FEMALES[1]),
  sumCols(rows, COL.MALES[2], COL.FEMALES[2]),
  sumCols(rows, COL.MALES[3], COL.FEMALES[3]),
  sumCols(rows, COL.MALES[4], COL.FEMALES[4]),
  sumCols(rows, COL.MALES[5], COL.FEMALES[5]),
];

const sumHistoryAges = (rowset) => [
  rowset.map((rows) => sumCols(rows, COL.MALES[0], COL.FEMALES[0])).reverse(),
  rowset.map((rows) => sumCols(rows, COL.MALES[1], COL.FEMALES[1])).reverse(),
  rowset.map((rows) => sumCols(rows, COL.MALES[2], COL.FEMALES[2])).reverse(),
  rowset.map((rows) => sumCols(rows, COL.MALES[3], COL.FEMALES[3])).reverse(),
  rowset.map((rows) => sumCols(rows, COL.MALES[4], COL.FEMALES[4])).reverse(),
  rowset.map((rows) => sumCols(rows, COL.MALES[5], COL.FEMALES[5])).reverse(),
];

const participantsWithHistory = (rowset) => ({
  ...participants(rowset[0]),
  ages: sumHistoryAges(rowset),
});

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

/**
 * @returns {import("../types/reports").AgeSet<Array<string>>}
 */
const topAges = (summed) => [
  topAge(summed, 0),
  topAge(summed, 1),
  topAge(summed, 2),
  topAge(summed, 3),
  topAge(summed, 4),
  topAge(summed, 5),
];

const countOrganizations = (rows) =>
  new Set(rows.map((row) => `${row[COL.ASSOCIATION]}:${row[COL.ORGANIZATION]}`))
    .size;

const associationSummer =
  (rows, lastYearRows = [[]]) =>
  (assoc) => {
    const aData = rows.filter(associationFilter(assoc));
    const bData = lastYearRows.filter(associationFilter(assoc));
    return {
      courses: aData.length,
      participants: participants(aData),
      hours: sumHours(aData),
      lastYearHours: sumHours(bData),
      facilitated: facilitated(aData),
    };
  };

const organizationSummer =
  (rows, lastYearRows = [[]]) =>
  (org) => {
    const aData = rows.filter(organizationFilter(org));
    const bData = lastYearRows.filter(organizationFilter(org));
    return {
      courses: aData.length,
      participants: participants(aData),
      hours: sumHours(aData),
      lastYearHours: sumHours(bData),
      facilitated: facilitated(aData),
    };
  };

const getCompactMunicipalityData = (rows, municipalities) => {
  const municipalitiesSet = new Set(rows.map((row) => row[COL.MUNICIPALITY]));

  /** @type {Record<string, import("../types/reports").CompactValues>} */
  const output = {};

  Object.keys(municipalities)
    .filter((value) => municipalitiesSet.has(Number(value)))
    .map((mun) => {
      const aData = rows.filter((row) => row[COL.MUNICIPALITY] === Number(mun));
      const pp = participants(aData, false);
      output[mun] = [
        aData.length,
        sumHours(aData),
        pp.males + pp.females,
        aData.length / municipalities[mun].pop,
      ];
    });

  return output;
};

const historical = (rowset) => ({
  courses: rowset.map((rows) => rows.length).reverse(),
  hours: rowset.map(sumHours).reverse(),
  participants: rowset.map(sumParticipants).reverse(),
});

/**
 *
 * @param {Array<Array<Array<any>>>} datasets
 */
const participantsHistogram = (...datasets) => {
  /** @type Array<import("../types/reports").ParticipantsHistogramType> */
  const result = [];

  datasets.forEach((rows) => {
    /** @type import("../types/reports").ParticipantsHistogramType */
    const histogram = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // 0-3, 4-7, ... 40+

    rows.forEach((row) => {
      const index = Math.trunc(
        COL.MALES.concat(COL.FEMALES).reduce((acc, col) => acc + row[col], 0) /
          4
      );

      if (index < 10) {
        histogram[index]++;
      } else {
        histogram[10]++;
      }
    });

    result.push(histogram);
  });

  return result;
};

/**
 *
 * @param {Array<Array<any>>} rows
 */
const participantsHistogramSums = (rows) => {
  /** @type import("../types/reports").ParticipantsHistogramType */
  const histogram = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // 0-3, 4-7, ... 40+

  rows.forEach((row) => {
    const participants = COL.MALES.concat(COL.FEMALES).reduce(
      (acc, col) => acc + row[col],
      0
    );
    const index = Math.trunc(participants / 4);

    if (index < 10) {
      histogram[index] += participants;
    } else {
      histogram[10] += participants;
    }
  });

  return histogram;
};

module.exports = {
  sumHours,
  sumParticipants,
  historical,
  participants,
  participantsHistogram,
  participantsHistogramSums,
  participantsWithHistory,
  facilitated,
  countOrganizations,
  associationSummer,
  organizationSummer,
  mainSubjectSums,
  subjectSums,
  topAges,
  getCompactMunicipalityData,
  COL,
};
