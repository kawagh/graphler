#!/usr/bin/env node
import { createRequire } from "node:module";
import { parseArgs } from "node:util";
import { extract } from "./extract.ts";
import { serve } from "./serve.ts";

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    json: { type: "boolean", default: false },
    port: { type: "string", default: "0" },
    "no-open": { type: "boolean", default: false },
    version: { type: "boolean", short: "v", default: false },
  },
});

if (values.version) {
  // src/ と dist/ のどちらから実行しても、1つ上の階層に cli の package.json がある
  const { version } = createRequire(import.meta.url)("../package.json") as {
    version: string;
  };
  process.stdout.write(`${version}\n`);
  process.exit(0);
}

const targets = positionals.length > 0 ? positionals : ["."];
const data = await extract(targets, process.cwd());

if (values.json) {
  process.stdout.write(`${JSON.stringify(data, null, 2)}\n`);
} else {
  serve(data, Number(values.port), !values["no-open"]);
}
