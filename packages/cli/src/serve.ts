import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import type { GraphlerData } from "@graphler/schema";

const CONTENT_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".md": "text/markdown; charset=utf-8",
};

/** 公開時は dist/viewer に同梱したもの、開発時(src から実行)は viewer パッケージのビルド結果を使う */
function findViewerDir(): string {
  const candidates = [
    fileURLToPath(new URL("./viewer", import.meta.url)),
    fileURLToPath(new URL("../../viewer/dist", import.meta.url)),
  ];
  const found = candidates.find((dir) => existsSync(join(dir, "index.html")));
  if (!found) {
    throw new Error("viewer のビルド結果が見つかりません。先に pnpm build を実行してください");
  }
  return found;
}

/** viewer と graph.json をローカルで配信し、ブラウザを開く */
export function serve(data: GraphlerData, port: number, open: boolean): void {
  const viewerDir = findViewerDir();
  const graphJson = JSON.stringify(data);

  const server = createServer((req, res) => {
    const pathname = new URL(req.url ?? "/", "http://localhost").pathname;
    if (pathname === "/graph.json") {
      res.writeHead(200, { "Content-Type": CONTENT_TYPES[".json"] });
      res.end(graphJson);
      return;
    }
    const file = join(viewerDir, normalize(pathname === "/" ? "/index.html" : pathname));
    if (!file.startsWith(viewerDir) || !existsSync(file)) {
      res.writeHead(404);
      res.end("Not Found");
      return;
    }
    res.writeHead(200, {
      "Content-Type": CONTENT_TYPES[extname(file)] ?? "application/octet-stream",
    });
    res.end(readFileSync(file));
  });

  // 外部から接続されないよう localhost だけで待ち受ける
  server.listen(port, "127.0.0.1", () => {
    const address = server.address();
    const actualPort = typeof address === "object" && address ? address.port : port;
    const url = `http://localhost:${actualPort}/`;
    console.log(`graphler: ${url} で表示しています(Ctrl+C で終了)`);
    if (open) openBrowser(url);
  });
}

function openBrowser(url: string): void {
  const command =
    process.platform === "darwin" ? "open" : process.platform === "win32" ? "explorer" : "xdg-open";
  spawn(command, [url], { stdio: "ignore", detached: true })
    .on("error", () => console.log(`ブラウザを開けませんでした。${url} を開いてください`))
    .unref();
}
