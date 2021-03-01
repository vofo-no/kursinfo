/**
 * Set up plugins
 */
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const plugins = [withBundleAnalyzer];

/**
 * Set up Next.js configuration
 */
const defaultParams = require("./lib/getDefaultParams");
const SFS = ["nm", "skt"];

const nextConfiguration = {
  async rewrites() {
    paths = [];
    const { year, county, group } = defaultParams();
    SFS.map((sf) => {
      paths.push(
        {
          source: `/${sf}`,
          destination: `/${sf}/${year}/${county}/${group}`,
        },
        {
          source: `/${sf}/:year`,
          destination: `/${sf}/:year/${county}/${group}`,
        },
        {
          source: `/${sf}/:year/:county`,
          destination: `/${sf}/:year/:county/${group}`,
        }
      );
    });
    return paths;
  },
};

const withPlugins = require("next-compose-plugins");
module.exports = withPlugins([...plugins], nextConfiguration);
