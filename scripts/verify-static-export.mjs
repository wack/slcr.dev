// Fails the build unless `next build` produced a static export in `out/`.
//
// `output: "export"` in next.config.ts already makes `next build` reject any
// route that needs a server. This script guards against the config itself
// drifting: if someone removes `output: "export"`, `next build` still succeeds
// (as a server build), so we check the export's own artifacts instead.
// See "Static site generation" in AGENTS.md.
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const distDir = path.resolve(".next");
const outDir = path.resolve("out");

function fail(message) {
  console.error(`\n✗ Static export check failed: ${message}`);
  console.error(
    '  This site must be built with `output: "export"` (see AGENTS.md).\n',
  );
  process.exit(1);
}

const exportDetailPath = path.join(distDir, "export-detail.json");
if (!existsSync(exportDetailPath)) {
  fail(`${path.relative(process.cwd(), exportDetailPath)} is missing.`);
}

const exportDetail = JSON.parse(readFileSync(exportDetailPath, "utf8"));
if (!exportDetail.success) {
  fail("Next.js reported the static export as unsuccessful.");
}
if (path.resolve(exportDetail.outDirectory) !== outDir) {
  fail(`export was written to ${exportDetail.outDirectory}, expected ${outDir}.`);
}
if (!existsSync(path.join(outDir, "index.html"))) {
  fail("out/index.html is missing.");
}

console.log("✓ Static export verified in out/");
