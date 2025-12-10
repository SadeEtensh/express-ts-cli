#!/usr/bin/env node

import { Command } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";
import { generateFeatureBasedStructure } from "../generators/feature-based";
import { generateServiceBasedStructure } from "../generators/service-based";
import { createProject } from "../generators/common";

const program = new Command();

program
  .version("1.0.0")
  .description(
    "Generate Express.js TypeScript boilerplate with different architectures"
  );

program
  .command("new <project-name>")
  .description("Create a new Express.js TypeScript project")
  .option("-a, --architecture <type>", "Project architecture (feature|service)")
  .option("-d, --database <type>", "Database type (mongodb|postgresql|mysql)")
  .action(async (projectName, options) => {
    try {
      let { architecture, database } = options;

      if (!architecture) {
        const answers = await inquirer.prompt([
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
        const answers = await inquirer.prompt([
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

      console.log(
        chalk.blue(
          `Creating ${architecture} based Express TypeScript project...`
        )
      );

      await createProject(projectName, architecture, database);

      console.log(chalk.green("✅ Project created successfully!"));
      console.log(chalk.yellow("\nNext steps:"));
      console.log(`  cd ${projectName}`);
      console.log("  npm install");
      console.log("  npm run dev");
    } catch (error) {
      console.error(chalk.red("Error creating project:"), error);
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
        await generateFeatureBasedStructure(process.cwd(), name);
        console.log(
          chalk.green(`✅ Feature '${name}' generated successfully!`)
        );
      } else if (type === "service") {
        console.log(
          chalk.yellow(
            "ℹ️  Service-based architecture uses centralized services."
          )
        );
        console.log(
          chalk.yellow("   Add your service logic in src/services/ directory.")
        );
      } else {
        console.log(chalk.red('❌ Invalid type. Use "feature" or "service"'));
      }
    } catch (error) {
      console.error(chalk.red("Error generating component:"), error);
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
