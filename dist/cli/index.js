#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const inquirer_1 = __importDefault(require("inquirer"));
const chalk_1 = __importDefault(require("chalk"));
const feature_based_1 = require("../generators/feature-based");
const common_1 = require("../generators/common");
const program = new commander_1.Command();
program
    .version("1.0.0")
    .description("Generate Express.js TypeScript boilerplate with different architectures");
program
    .command("new <project-name>")
    .description("Create a new Express.js TypeScript project")
    .option("-a, --architecture <type>", "Project architecture (feature|service)")
    .option("-d, --database <type>", "Database type (mongodb|postgresql|mysql)")
    .action(async (projectName, options) => {
    try {
        let { architecture, database } = options;
        if (!architecture) {
            const answers = await inquirer_1.default.prompt([
                {
                    type: "list",
                    name: "architecture",
                    message: "Choose project architecture:",
                    choices: [
                        { name: "Feature-based", value: "feature" },
                        { name: "Service-based", value: "service" },
                    ],
                },
            ]);
            architecture = answers.architecture;
        }
        if (!database) {
            const answers = await inquirer_1.default.prompt([
                {
                    type: "list",
                    name: "database",
                    message: "Choose database:",
                    choices: [
                        { name: "MongoDB", value: "mongodb" },
                        { name: "PostgreSQL", value: "postgresql" },
                        { name: "MySQL", value: "mysql" },
                        { name: "None", value: "none" },
                    ],
                },
            ]);
            database = answers.database;
        }
        console.log(chalk_1.default.blue(`Creating ${architecture} based Express TypeScript project...`));
        await (0, common_1.createProject)(projectName, architecture, database);
        console.log(chalk_1.default.green("✅ Project created successfully!"));
        console.log(chalk_1.default.yellow("\nNext steps:"));
        console.log(`  cd ${projectName}`);
        console.log("  npm install");
        console.log("  npm run dev");
    }
    catch (error) {
        console.error(chalk_1.default.red("Error creating project:"), error);
        process.exit(1);
    }
});
program
    .command("generate <type> <name>")
    .description("Generate a new feature/service component")
    .action(async (type, name) => {
    try {
        if (type === "feature") {
            // Use process.cwd() to get the current working directory
            await (0, feature_based_1.generateFeatureBasedStructure)(process.cwd(), name);
            console.log(chalk_1.default.green(`✅ Feature '${name}' generated successfully!`));
        }
        else if (type === "service") {
            console.log(chalk_1.default.yellow("ℹ️  Service-based architecture uses centralized services."));
            console.log(chalk_1.default.yellow("   Add your service logic in src/services/ directory."));
        }
        else {
            console.log(chalk_1.default.red('❌ Invalid type. Use "feature" or "service"'));
        }
    }
    catch (error) {
        console.error(chalk_1.default.red("Error generating component:"), error);
    }
});
// program
//   .command("generate <type> <name>")
//   .description("Generate a new feature/service component")
//   .action(async (type, name) => {
//     try {
//       if (type === "feature") {
//         await generateFeatureBasedStructure(process.cwd(), name);
//         console.log(
//           chalk.green(`✅ Feature '${name}' generated successfully!`)
//         );
//       } else if (type === "service") {
//         // For service generation in service-based architecture
//         console.log(
//           chalk.yellow(
//             "ℹ️  Service-based architecture uses centralized services."
//           )
//         );
//         console.log(
//           chalk.yellow("   Add your service logic in src/services/ directory.")
//         );
//       } else {
//         console.log(chalk.red('❌ Invalid type. Use "feature" or "service"'));
//       }
//     } catch (error) {
//       console.error(chalk.red("Error generating component:"), error);
//     }
//   });
program.parse();
