const defaultParams = require("./lib/getDefaultParams");
const SFS = ["nm", "skt", "funkis", "msf", "k-stud"];

/**
 * @type {import('next').NextConfig}
 */
const nextConfiguration = {
  async rewrites() {
    const paths = [];
    const { year, county, organization, group } = defaultParams();
    SFS.map((sf) => {
      paths.push(
        {
          source: `/${sf}`,
          destination: `/${sf}/${year}/${county}/${organization}/${group}`,
        },
        {
          source: `/${sf}/:year`,
          destination: `/${sf}/:year/${county}/${organization}/${group}`,
        },
        {
          source: `/${sf}/:year/:county`,
          destination: `/${sf}/:year/:county/${organization}/${group}`,
        },
        {
          source: `/${sf}/:year/:county/:organization`,
          destination: `/${sf}/:year/:county/:organization/${group}`,
        }
      );
    });
    return paths;
  },
  i18n: {
    locales: ["nb"],
    defaultLocale: "nb",
  },
};

module.exports = nextConfiguration;
