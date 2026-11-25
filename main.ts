import * as fs from "node:fs";
import * as path from "node:path";

// One Line, One Laugh — coral-laugh-01
// Winner from SCREENING.md (C2): concrete image, turn is the joke, punch word last.
const LINE =
  "I bought a standing desk and now I just sit on the floor next to it, out of spite.";

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

function main(): void {
  // Gate validation: the entry must be 1-200 chars, a single line, no leading or
  // trailing whitespace, and no double spaces (economy check on the line itself).
  if (LINE.length < 1 || LINE.length > 200) {
    fail(`line is ${LINE.length} chars, must be 1-200`);
  }
  if (LINE.includes("\n") || LINE.includes("\r")) {
    fail("line must be a single line");
  }
  if (LINE !== LINE.trim()) {
    fail("line has leading or trailing whitespace");
  }
  if (LINE.includes("  ")) {
    fail("line contains double spaces");
  }
  // Reject invisible trouble: control characters and non-breaking spaces would
  // count toward the 200-char gate while reading as nothing on screen.
  if (/[\u0000-\u001F\u007F\u00A0\u2000-\u200B]/.test(LINE)) {
    fail("line contains a control character or exotic whitespace");
  }

  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, "entry.txt");

  // Write without a trailing newline: the gate counts characters, so the file
  // must be exactly the line, byte for byte.
  fs.writeFileSync(outFile, LINE, "utf8");

  // Read back and verify byte-exact equality (string and byte length) and no
  // trailing newline.
  const readBack = fs.readFileSync(outFile, "utf8");
  if (readBack !== LINE) {
    fail("read-back mismatch: entry.txt does not equal the line byte for byte");
  }
  if (Buffer.byteLength(readBack, "utf8") !== Buffer.byteLength(LINE, "utf8")) {
    fail("read-back mismatch: byte length differs from the line");
  }
  if (readBack.endsWith("\n")) {
    fail("entry.txt has a trailing newline");
  }

  console.log(`wrote ${outFile} (${LINE.length} chars)`);
}

main();
