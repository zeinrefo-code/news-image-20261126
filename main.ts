// Delivery program for the news-image-20261126 entry.
//
// Reads the bundled entry.png sitting next to this script, verifies that
// it really is a PNG of a plausible size, copies it into the output
// directory, and then proves the copy is byte-for-byte identical by
// hashing both the source and the written file with SHA-256.
//
// Usage:
//   node main.ts           copy entry.png into the output directory
//   node main.ts --check   dry run: validate and hash only, write nothing
//
// The output directory comes from the MAKEFUN_OUTPUT_DIR environment
// variable and defaults to "out" (relative to the working directory).

import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// The first eight bytes of every PNG file, per the PNG specification.
const PNG_SIGNATURE: number[] = [137, 80, 78, 71, 13, 10, 26, 10];

// A finished newspaper-style image is far bigger than this; anything
// smaller almost certainly means the asset is missing or truncated.
const MINIMUM_BYTES = 10 * 1024;

function sha256Hex(bytes: Buffer): string {
  return createHash("sha256").update(bytes).digest("hex");
}

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

function loadAndValidateSource(): Buffer {
  const scriptDir = dirname(fileURLToPath(import.meta.url));
  const sourcePath = join(scriptDir, "entry.png");

  let bytes: Buffer;
  try {
    bytes = readFileSync(sourcePath);
  } catch {
    fail(`could not read source image at ${sourcePath}`);
  }

  if (bytes.length < PNG_SIGNATURE.length) {
    fail(`source image is only ${bytes.length} bytes - too short to be a PNG`);
  }
  for (let i = 0; i < PNG_SIGNATURE.length; i++) {
    if (bytes[i] !== PNG_SIGNATURE[i]) {
      fail("source image does not start with the PNG signature");
    }
  }

  if (bytes.length < MINIMUM_BYTES) {
    fail(
      `source image is ${bytes.length} bytes, below the ${MINIMUM_BYTES}-byte minimum`
    );
  }

  return bytes;
}

function main(): void {
  const source = loadAndValidateSource();
  const sourceHash = sha256Hex(source);

  // Dry-run mode: report the digest of the validated source image and
  // stop before anything touches the output directory.
  if (process.argv.slice(2).includes("--check")) {
    console.log(
      `check ok: entry.png is a valid PNG, ${source.length} bytes, sha256 ${sourceHash}`
    );
    return;
  }

  const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "out";
  mkdirSync(outputDir, { recursive: true });
  const targetPath = join(outputDir, "entry.png");
  writeFileSync(targetPath, source);

  // Read the file back from disk and compare digests, so a silent
  // partial write or filesystem mix-up can never slip through.
  const written = readFileSync(targetPath);
  const writtenHash = sha256Hex(written);
  if (writtenHash !== sourceHash) {
    fail(
      `verification failed: wrote sha256 ${writtenHash} but source is ${sourceHash}`
    );
  }

  console.log(
    `entry.png: ${source.length} bytes, sha256 ${sourceHash.slice(0, 12)} copied to ${targetPath}`
  );
}

main();
