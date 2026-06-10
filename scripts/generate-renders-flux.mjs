/**
 * Generates the 18 Industrial Premium renders with FLUX 1.1 [pro] via the
 * official Black Forest Labs API (api.bfl.ai), reading every prompt verbatim
 * from docs/IMAGE-RENDER-PROMPTS-FLUX.md (single source of truth).
 *
 * Run:   BFL_API_KEY=xxx node scripts/generate-renders-flux.mjs
 * Flags: --dry-run            print the parsed batch without calling the API
 *        --only id1,id2       generate only the listed ids
 *        --out <dir>          output dir (default: renders-output/)
 *
 * Output: <out>/<id>.png — ready for the existing WebP conversion +
 * ACTIVE_RENDERS activation flow (see docs/IMAGE-RENDER-PROMPTS-FLUX.md §Flujo).
 *
 * NOTE: the BFL API requires width/height in multiples of 32, so 16:9 uses
 * 1344×768 (the doc's API-safe alternative to 1440×808).
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DOC = join(ROOT, "docs", "IMAGE-RENDER-PROMPTS-FLUX.md");
const API_BASE = "https://api.bfl.ai/v1";
const MODEL_ENDPOINT = `${API_BASE}/flux-pro-1.1`;

// FLUX 1.1 Pro standard ("opción 1") — multiples of 32 required by the API.
const RATIO_DIMS = {
  "16:9": { width: 1344, height: 768 },
  "4:3": { width: 1152, height: 864 },
  "1:1": { width: 1440, height: 1440 },
  "16:10": { width: 1280, height: 800 },
};

const POLL_INTERVAL_MS = 2_000;
const POLL_TIMEOUT_MS = 180_000;
const MAX_ATTEMPTS = 3;

function parseArgs(argv) {
  const args = { dryRun: false, only: null, out: join(ROOT, "renders-output") };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--dry-run") args.dryRun = true;
    else if (argv[i] === "--only") args.only = argv[++i].split(",").map((s) => s.trim());
    else if (argv[i] === "--out") args.out = argv[++i];
    else throw new Error(`Unknown flag: ${argv[i]}`);
  }
  return args;
}

/** Parses `### N. \`id\` — ratio R → \`path\`` headings + their ``` prompt blocks. */
function parsePromptDoc(markdown) {
  const lines = markdown.split(/\r?\n/);
  const entries = [];
  for (let i = 0; i < lines.length; i += 1) {
    const heading = lines[i].match(/^### \d+\. `([\w-]+)`.* ratio (\d+:\d+)/);
    if (!heading) continue;
    const [, id, ratio] = heading;
    const fenceStart = lines.indexOf("```", i + 1);
    const fenceEnd = lines.indexOf("```", fenceStart + 1);
    if (fenceStart === -1 || fenceEnd === -1) {
      throw new Error(`No prompt code block found for "${id}"`);
    }
    const prompt = lines
      .slice(fenceStart + 1, fenceEnd)
      .join(" ")
      .trim();
    if (!RATIO_DIMS[ratio]) throw new Error(`Unknown ratio "${ratio}" for "${id}"`);
    entries.push({ id, ratio, prompt, ...RATIO_DIMS[ratio] });
    i = fenceEnd;
  }
  return entries;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function requestGeneration(apiKey, entry) {
  const res = await fetch(MODEL_ENDPOINT, {
    method: "POST",
    headers: { "x-key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt: entry.prompt,
      width: entry.width,
      height: entry.height,
      output_format: "png",
      prompt_upsampling: false,
      safety_tolerance: 2,
    }),
  });
  if (!res.ok) {
    throw new Error(`POST ${MODEL_ENDPOINT} → ${res.status}: ${await res.text()}`);
  }
  return res.json(); // { id, polling_url }
}

async function pollResult(apiKey, task) {
  const pollUrl = task.polling_url ?? `${API_BASE}/get_result?id=${task.id}`;
  const deadline = Date.now() + POLL_TIMEOUT_MS;
  while (Date.now() < deadline) {
    await sleep(POLL_INTERVAL_MS);
    const res = await fetch(pollUrl, { headers: { "x-key": apiKey } });
    if (!res.ok) throw new Error(`Polling failed → ${res.status}: ${await res.text()}`);
    const data = await res.json();
    if (data.status === "Ready") return data.result.sample;
    if (data.status === "Pending" || data.status === "Processing" || data.status === "Queued") continue;
    throw new Error(`Generation ended with status "${data.status}": ${JSON.stringify(data)}`);
  }
  throw new Error(`Timed out after ${POLL_TIMEOUT_MS / 1000}s waiting for result`);
}

async function downloadTo(url, filePath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed → ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  writeFileSync(filePath, buffer);
  return buffer.length;
}

async function generateOne(apiKey, entry, outDir) {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      const task = await requestGeneration(apiKey, entry);
      const sampleUrl = await pollResult(apiKey, task);
      const filePath = join(outDir, `${entry.id}.png`);
      const bytes = await downloadTo(sampleUrl, filePath);
      console.log(`  ✔ ${entry.id} (${entry.width}×${entry.height}) → ${filePath} [${Math.round(bytes / 1024)} KB]`);
      return true;
    } catch (error) {
      console.error(`  ✖ ${entry.id} attempt ${attempt}/${MAX_ATTEMPTS}: ${error.message}`);
      if (attempt < MAX_ATTEMPTS) await sleep(3_000 * attempt);
    }
  }
  return false;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const doc = readFileSync(DOC, "utf8");
  const all = parsePromptDoc(doc);
  if (all.length === 0) throw new Error(`No prompts parsed from ${DOC}`);

  const batch = args.only ? all.filter((e) => args.only.includes(e.id)) : all;
  if (args.only && batch.length !== args.only.length) {
    const known = new Set(all.map((e) => e.id));
    const missing = args.only.filter((id) => !known.has(id));
    throw new Error(`Unknown ids in --only: ${missing.join(", ")}`);
  }

  console.log(`FLUX 1.1 [pro] batch — ${batch.length}/${all.length} prompts from docs/IMAGE-RENDER-PROMPTS-FLUX.md\n`);
  for (const entry of batch) {
    console.log(`  • ${entry.id.padEnd(22)} ${entry.ratio.padEnd(5)} ${entry.width}×${entry.height}  (${entry.prompt.length} chars)`);
  }

  if (args.dryRun) {
    console.log("\nDry run — no API calls made.");
    return;
  }

  const apiKey = process.env.BFL_API_KEY;
  if (!apiKey) {
    throw new Error(
      "BFL_API_KEY not configured. Get one at https://api.bfl.ai and run:\n" +
        "  BFL_API_KEY=xxx node scripts/generate-renders-flux.mjs",
    );
  }

  if (!existsSync(args.out)) mkdirSync(args.out, { recursive: true });
  console.log(`\nOutput dir: ${args.out}\n`);

  const failed = [];
  for (const entry of batch) {
    const ok = await generateOne(apiKey, entry, args.out);
    if (!ok) failed.push(entry.id);
  }

  console.log(`\nDone: ${batch.length - failed.length}/${batch.length} generated.`);
  if (failed.length > 0) {
    console.error(`Failed: ${failed.join(", ")}`);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
