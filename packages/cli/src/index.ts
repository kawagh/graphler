#!/usr/bin/env node
import { parseArgs } from "node:util";
import { extract } from "./extract.ts";

const { positionals } = parseArgs({
  allowPositionals: true,
  options: {
    json: { type: "boolean", default: false },
  },
});

const targets = positionals.length > 0 ? positionals : ["."];
const data = await extract(targets, process.cwd());

process.stdout.write(`${JSON.stringify(data, null, 2)}\n`);
