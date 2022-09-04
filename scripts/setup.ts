import { exec } from "child_process";
import { satisfies } from "semver";
import { createLogger, format, transports } from "winston";
import ora from "ora";

const { combine, colorize, simple } = format;

const spinner = ora();
spinner.color = "green";

class Task {
  constructor(public command: string, public label: string) { }
}

const logger = createLogger({
  transports: [new transports.Console()],
  format: combine(colorize(), simple()),
});

function preValidate() {
  const { engines } = require("../package.json");
  const { node: nodeRange, npm } = engines;
  const npm_config_user_agent = process.env.npm_config_user_agent;
  const currentNpmVersionArray = npm_config_user_agent?.match(
    /npm\/[\^*\~*]*[\d\.]+/
  );
  const currentNpmVersion = currentNpmVersionArray[0]?.slice(4);
  if (!currentNpmVersionArray || !currentNpmVersion) {
    logger.error(
      "Mmmmm... it seems like you don't have permission to run the script. Try to run it as an administrator."
    );
    process.exit(1);
  }
  const currentNode = process.versions.node;
  if (!satisfies(currentNode, nodeRange)) {
    logger.error(
      `This system seems to use an incompatible Node.js version, current version: ${currentNode} required version: ${nodeRange}`
    );
    process.exit(1);
  }
  if (!satisfies(currentNpmVersion, npm)) {
    logger.error(
      `This system seems to use an incompatible NPM version, current version: ${currentNpmVersion} required version: ${npm}`
    );
    process.exit(1);
  }
}

async function runFunction(task: Task): Promise<string> {
  spinner.start(`${task.label}` + "\n");
  return new Promise((resolve, reject) => {
    exec(task.command, (error, stdout, stderr) => {
      error && reject(error);
      if (stdout) {
        spinner.succeed(`Finished ${task.label}`);
        stdout && resolve(task.label);
      }
    });
  });
}

const clean: Task[] = [
  {
    command: "npm run clean",
    label: "clean up 🧼",
  },
];
const bootstrap: Task[] = [
  {
    command: "npm run bootstrap",
    label: "bootstrapping 🚀",
  },
];
const buildStep: Task[] = [
  {
    command: "npm run build",
    label: "build packages 📦",
  },
];
const dockerCompose: Task[] = [
  {
    command: "npm run docker:dev",
    label: "docker compose 🐳",
  },
];
const prismaGeneration: Task[] = [
  {
    command: "npm run prisma:generate",
    label: "generate prisma 🧬",
  },
];
const graphqlGeneration: Task[] = [
  {
    command: "npm run generate",
    label: "generate graphql schema 🧬",
  },
];
const prismaMigration: Task[] = [
  {
    command: "npm run migrate:up",
    label: "prisma migration 🏗 ",
  },
];

const tasks: Task[][] = [
  clean,
  bootstrap,
  buildStep,
  dockerCompose,
  prismaGeneration,
  graphqlGeneration,
  prismaMigration,
];

if (require.main === module) {
  (async () => {
    try {
      preValidate();
      logger.info(`Welcome to Microservices installer!`);
      console.log("");

      for (let i = 0; i < tasks.length; i++) {
        const step = tasks[i];

        logger.info(`Starting step ${i + 1}/${tasks.length}`);
        const tasksPromises = step.map((task) => {
          return runFunction(task);
        });
        await Promise.all(tasksPromises);
        console.log("");
      }
      logger.info("Finish all the process for the setup, have fun hacking 👾");
      logger.info(
        "✋ To run a specific service, go to its README file and make sure you set all necessary environment variables❗️"
      );
    } catch (error) {
      spinner.fail(error.message);
    }
  })();
}
