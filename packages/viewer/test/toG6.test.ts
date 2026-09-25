import assert from "node:assert/strict";
import { test } from "node:test";
import type { GraphlerData } from "@graphler/schema";
import { toG6 } from "../src/toG6.ts";

/** パスの一覧から、依存の無い GraphlerData を作る */
function dataOf(ids: string[]): GraphlerData {
  return {
    root: ".",
    modules: ids.map((id) => ({ id, path: id.split("/") })),
    dependencies: [],
  };
}

/** combo の id と、最初に畳まれているかどうかの対応 */
function collapsedOf(data: GraphlerData) {
  return Object.fromEntries(
    (toG6(data).combos ?? []).map((c) => [c.id, (c.style as { collapsed: boolean }).collapsed]),
  );
}

test("共通するディレクトリは開き、その直下のフォルダから先は畳む", () => {
  const data = dataOf([
    "src/index.ts",
    "src/adapter/bun/index.ts",
    "src/adapter/deno.ts",
    "src/utils/url.ts",
  ]);

  assert.deepEqual(collapsedOf(data), {
    "dir:src": false,
    "dir:src/adapter": true,
    "dir:src/adapter/bun": true,
    "dir:src/utils": true,
  });
});

test("共通するディレクトリが無ければ、トップレベルのフォルダをすべて畳む", () => {
  const data = dataOf(["index.ts", "src/main.ts", "lib/util/a.ts"]);

  assert.deepEqual(collapsedOf(data), {
    "dir:src": true,
    "dir:lib": true,
    "dir:lib/util": true,
  });
});

test("共通するディレクトリが複数階層なら、その最も深いものまで開く", () => {
  const data = dataOf(["packages/cli/src/a.ts", "packages/cli/src/sub/b.ts"]);

  assert.deepEqual(collapsedOf(data), {
    "dir:packages": false,
    "dir:packages/cli": false,
    "dir:packages/cli/src": false,
    "dir:packages/cli/src/sub": true,
  });
});
