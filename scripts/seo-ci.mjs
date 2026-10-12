#!/usr/bin/env node
/**
 * Builds the site, serves the production build on a spare port and runs the SEO
 * checks against it. Usage: npm run seo:test   (add -- --skip-build to reuse .next)
 */
import { spawn, spawnSync } from "node:child_process";
import { createServer } from "node:net";

const skipBuild = process.argv.includes("--skip-build");
const env = { ...process.env };
delete env.SEO_NOINDEX; // checks assert production behaviour

if (!skipBuild) {
  const build = spawnSync("npx", ["next", "build"], { stdio: "inherit", env });
  if (build.status !== 0) process.exit(build.status ?? 1);
}

const port = await new Promise((resolve) => {
  const srv = createServer().listen(0, () => {
    const { port } = srv.address();
    srv.close(() => resolve(port));
  });
});
const server = spawn("npx", ["next", "start", "-p", String(port)], { env, stdio: ["ignore", "pipe", "inherit"] });
await new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(new Error("next start did not become ready")), 30000);
  server.stdout.on("data", (chunk) => {
    if (/Ready|started server|Local:/i.test(String(chunk))) {
      clearTimeout(timer);
      setTimeout(resolve, 500);
    }
  });
});

const check = spawnSync("node", ["scripts/seo-check.mjs"], { stdio: "inherit", env: { ...env, BASE: `http://localhost:${port}` } });
server.kill();
process.exit(check.status ?? 1);
