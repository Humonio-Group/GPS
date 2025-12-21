import { execSync } from "node:child_process";

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log("❌ Please specify at least one module to add");
    console.log("\n📖 Usage: tsx scripts/nuxt/add-module.ts <module-name> [module-name...]");
    console.log("\nExample: tsx scripts/nuxt/add-module.ts @nuxtjs/tailwindcss");
    process.exit(1);
  }

  const modules = args.join(" ");
  console.log(`📦 Adding Nuxt modules: ${modules}\n`);

  try {
    execSync(`npx nuxi@latest module add ${modules}`, {
      stdio: "inherit",
      cwd: process.cwd(),
    });
    console.log("\n✅ Modules added successfully!");

    console.log("\n🚨 Starting the linting process...");
    execSync("yarn lint", {
      stdio: "inherit",
      cwd: process.cwd(),
    });
  }
  catch (error) {
    console.error("\n❌ Error while adding modules:", error);
    process.exit(1);
  }
}

main();
