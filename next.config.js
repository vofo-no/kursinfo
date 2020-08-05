const withPlugins = require("next-compose-plugins");
const TM = require("next-transpile-modules")(["vofo-design"]);

module.exports = withPlugins([TM]);
