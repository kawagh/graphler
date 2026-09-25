import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

// --version は index.ts のトップレベルで process.argv を読んで終了するため、CLI を子プロセスとして実行して確かめる
const cli = fileURLToPath(new URL("../src/index.ts", import.meta.url));
const { version } = createRequire(import.meta.url)("../package.json") as { version: string };

for (const flag of ["--version", "-v"]) {
  test(`${flag} で package.json のバージョンだけを表示して正常に終了する`, () => {
    // 終了コードが 0 以外なら execFileSync が例外を投げる。
    // --version を処理せずに解析やサーバーの起動へ進むと終わらないので、タイムアウトで失敗させる
    const out = execFileSync(process.execPath, [cli, flag], { encoding: "utf8", timeout: 10_000 });
    assert.equal(out, `${version}\n`);
  });
}
