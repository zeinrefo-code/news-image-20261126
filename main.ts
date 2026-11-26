// news-image-20261126 delivery tool.
// Copies the generated entry image into the make.fun output folder and
// proves the copy is byte-identical, so the submitted bundle is verifiable.

import { createHash } from "node:crypto";
import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const MIN_BYTES = 10 * 1024;
const IMAGE_NAME = "entry.png";

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

function sha256Hex(path: string): string {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function main(): void {
  const dryRun = process.argv.includes("--check");
  const here = dirname(fileURLToPath(import.meta.url));
  const source = join(here, IMAGE_NAME);

  if (!existsSync(source)) {
    fail(`source image not found: ${source}`);
  }

  const bytes = readFileSync(source);
  if (bytes.length < PNG_MAGIC.length || !bytes.subarray(0, PNG_MAGIC.length).equals(PNG_MAGIC)) {
    fail(`${IMAGE_NAME} is not a PNG file (bad 8-byte signature)`);
  }
  if (bytes.length < MIN_BYTES) {
    fail(`${IMAGE_NAME} is only ${bytes.length} bytes; expected at least ${MIN_BYTES}`);
  }

  const sourceHash = sha256Hex(source);
  console.log(`${IMAGE_NAME}: ${bytes.length} bytes, sha256 ${sourceHash}`);

  if (dryRun) {
    console.log("dry run (--check): image validated, nothing written.");
    return;
  }

  const outDir = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? "out");
  mkdirSync(outDir, { recursive: true });
  const target = join(outDir, IMAGE_NAME);
  copyFileSync(source, target);

  const copied = statSync(target);
  if (copied.size !== bytes.length) {
    // A short copy would silently ship a corrupt image, so fail loudly.
    fail(`copied file is truncated: ${copied.size} of ${bytes.length} bytes written`);
  }
  const targetHash = sha256Hex(target);
  if (targetHash !== sourceHash) {
    fail(`copied file hash mismatch: ${targetHash} vs ${sourceHash}`);
  }
  console.log(`delivered to ${target} (sha256 verified)`);
}

main();
