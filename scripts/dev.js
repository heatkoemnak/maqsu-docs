const net = require("net");
const { spawn } = require("child_process");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const tinaEntry = path.resolve(
  __dirname,
  "..",
  "node_modules",
  "@tinacms",
  "cli",
  "bin",
  "tinacms"
);

const env = {
  ...process.env,
  CHOKIDAR_USEPOLLING: process.env.CHOKIDAR_USEPOLLING || "1",
  CHOKIDAR_INTERVAL: process.env.CHOKIDAR_INTERVAL || "250",
  WATCHPACK_POLLING: process.env.WATCHPACK_POLLING || "true",
};

const preferredPort = Number(process.env.TINA_DATALAYER_PORT || "3000");
const extraArgs = process.argv.slice(2);

function checkPort(port) {
  return new Promise((resolve) => {
    const server = net.createServer();

    server.once("error", () => {
      resolve(false);
    });

    server.once("listening", () => {
      server.close(() => resolve(true));
    });

    server.listen(port, "127.0.0.1");
  });
}

async function findAvailablePort(startPort, attempts = 20) {
  for (let offset = 0; offset < attempts; offset += 1) {
    const port = startPort + offset;
    const available = await checkPort(port);
    if (available) {
      return port;
    }
  }

  throw new Error(`No available Tina datalayer port found starting at ${startPort}`);
}

async function main() {
  const datalayerPort = await findAvailablePort(preferredPort);

  if (datalayerPort !== preferredPort) {
    console.log(
      `Port ${preferredPort} is busy, starting Tina datalayer on port ${datalayerPort}`
    );
  }

  const child = spawn(
    process.execPath,
    [
      tinaEntry,
      "dev",
      "--datalayer-port",
      String(datalayerPort),
      "-c",
      "npm run start",
      ...extraArgs,
    ],
    {
      stdio: "inherit",
      env,
      cwd: projectRoot,
    }
  );

  child.on("error", (error) => {
    console.error("Failed to start Tina dev server:", error.message);
    process.exit(1);
  });

  child.on("exit", (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }
    process.exit(code ?? 0);
  });
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
