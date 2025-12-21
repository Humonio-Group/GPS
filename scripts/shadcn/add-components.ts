import { execSync } from "node:child_process";

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log("❌ Please specify at least one component to add");
    console.log("\n📖 Usage: tsx scripts/shadcn/add-components.ts <component-name> [component-name...]");
    console.log("\nExample: tsx scripts/shadcn/add-components.ts button card");
    process.exit(1);
  }

  const components = args.join(" ");
  console.log(`🎨 Adding components: ${components}\n`);

  try {
    execSync(`npx shadcn-vue@latest add ${components}`, {
      stdio: "inherit",
      cwd: process.cwd(),
    });
    console.log("\n✅ Components added successfully!");

    console.log("\n🚨 Starting the linting process...");
    execSync("yarn lint", {
      stdio: "inherit",
      cwd: process.cwd(),
    });
  }
  catch (error) {
    console.error("\n❌ Error while adding components:", error);
    process.exit(1);
  }
}

main();
