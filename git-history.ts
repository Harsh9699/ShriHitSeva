import { execSync } from 'child_process';

try {
  console.log("Git Status:");
  console.log(execSync("git status", { encoding: "utf8" }));
  
  console.log("\nGit Log:");
  console.log(execSync("git log -n 10 --oneline", { encoding: "utf8" }));
} catch (e: any) {
  console.log("Error running git:", e.message || e);
}
