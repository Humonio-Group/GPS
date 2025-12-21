import { execSync } from "node:child_process";

function main() {
  console.log("🎨 Initializing shadcn-vue...\n");

  try {
    execSync("npx shadcn-vue@latest init", {
      stdio: "inherit",
      cwd: process.cwd(),
    });
    console.log("\n✅ Initialization completed successfully!");

    console.log("\n🚨 Starting the linting process...");
    execSync("yarn lint", {
      stdio: "inherit",
      cwd: process.cwd(),
    });
  }
  catch (error) {
    console.error("\n❌ Error during initialization:", error);
    process.exit(1);
  }
}

main();
