import fs from "node:fs/promises";
import path from "node:path";

const firebotPath = path.resolve(process.env.HOME, ".config/Firebot/v5");

const profile = JSON.parse(
  await fs.readFile(path.resolve(firebotPath, "global-settings.json"), "utf-8")
).profiles.loggedInProfile;

const distPath = "./dist";
const scriptsPath = path.resolve(firebotPath, `profiles/${profile}/scripts`);

for (const file of await fs.readdir(distPath)) {
  const src = path.resolve(distPath, file);
  const dist = path.resolve(distPath, file.replace(/\.cjs$/, ".js"));
  const dest = path.resolve(scriptsPath, file.replace(/\.cjs$/, ".js"));

  await fs.copyFile(src, dist);
  await fs.copyFile(src, dest);

  console.log(`Deployed: ${file}`);
}
