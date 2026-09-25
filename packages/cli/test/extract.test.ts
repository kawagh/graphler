import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { extract } from "../src/extract.ts";

const fixture = (name: string) => fileURLToPath(new URL(`./fixtures/${name}`, import.meta.url));

test("同じモジュールを複数行で import しても、依存は1本にまとめる", async () => {
  const data = await extract(["."], fixture("duplicate-import"));

  const edges = data.dependencies.filter((d) => d.from === "main.ts" && d.to === "handler.ts");
  assert.equal(edges.length, 1);
  // 型の import と値の import の両方の種類を持つ
  assert.ok(edges[0].kinds.includes("type-only"));
  assert.ok(edges[0].kinds.includes("import"));
});

test("依存元と依存先の組はすべて一意になる", async () => {
  const data = await extract(["."], fixture("duplicate-import"));

  const pairs = data.dependencies.map((d) => `${d.from}->${d.to}`);
  assert.equal(new Set(pairs).size, pairs.length);
});
