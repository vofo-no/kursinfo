#!/usr/bin/env node
require("dotenv").config();
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const chalk = require("chalk");

const settings = require("./settings.json");

const { getAdapters } = require("./adapters");
const getTaskYears = require("./helpers/getTaskYears");
const fetchTask = require("./fetchTask");

const allTargets = settings.tenants.map((tenant) => tenant.dataTarget);
const defaultYears = getTaskYears();

const adapters = getAdapters();

yargs(hideBin(process.argv))
  .command(
    "fetch [sf..]",
    "Lag statistikk for angitt studieforbund",
    (yargs) => {
      yargs.positional("sf", {
        describe: "liste med nummer til studieforbund",
        type: "string",
        default: allTargets,
        choices: allTargets,
      });
    },
    fetchCommand,
  )
  .option("a", {
    alias: "adapter",
    type: "string",
    choices: Object.keys(adapters),
  })
  .option("y", {
    alias: "years",
    demandOption: true,
    type: "array",
    default: defaultYears,
  })
  .option("f", {
    alias: "force",
    describe: "Overskriv eksisterende filer",
    type: "boolean",
  })
  .help()
  .alias("help", "h").argv;

async function fetchCommand(argv) {
  try {
    const programExecutionTimer = chalk.green(
      "✅ By the power vested in me, by the law of the jungle, blah, blah, blah, blah... Be gone!",
    );
    console.time(programExecutionTimer);

    console.log(
      chalk.blueBright(
        "🥥 [robot voice] I am very clever king... tok tok tok tok... I am super genius... I am robot king of the monkey thing... compute... compute.",
      ),
    );

    const tasks = [];

    argv.sf.map((sf) => {
      const tenant = settings.tenants.find(
        (tenant) => tenant.dataTarget === sf,
      );

      argv.years.map((year) => tasks.push({ tenant, year }));
    });

    for (let task of tasks) {
      const adapterName = argv.adapter || task.tenant.adapter;
      const adapter = adapters[adapterName];

      if (!adapter) throw new Error(`Unknown adapter ${adapterName}`);

      await fetchTask(task, adapter, Boolean(argv.force));
    }

    console.timeEnd(programExecutionTimer);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
