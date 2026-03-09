const { spawn } = require("child_process");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const isWindows = process.platform === "win32";
const npmCmd = isWindows ? "npm.cmd" : "npm";

const children = [];

const run = (name, script) => {
  const command = isWindows ? "cmd.exe" : npmCmd;
  const args = isWindows ? ["/d", "/s", "/c", `npm run ${script}`] : ["run", script];
  const child = spawn(command, args, {
    cwd: projectRoot,
    stdio: "inherit",
    shell: false
  });

  child.on("exit", (code) => {
    if (code !== 0) {
      console.error(`[${name}] exited with code ${code}`);
      shutdown(code || 1);
    }
  });

  children.push(child);
};

const shutdown = (exitCode = 0) => {
  for (const child of children) {
    if (!child.killed) {
      child.kill();
    }
  }
  process.exit(exitCode);
};

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

run("backend", "dev:backend");
run("frontend", "dev:frontend");
