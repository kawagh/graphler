import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { cruise, type ICruiseResult } from "dependency-cruiser";
import extractTSConfig from "dependency-cruiser/config-utl/extract-ts-config";
import type { GraphlerData } from "@graphler/schema";

/** targets の依存関係を dependency-cruiser で抽出し、GraphlerData に変換する */
export async function extract(targets: string[], cwd: string): Promise<GraphlerData> {
  const tsConfigPath = resolve(cwd, "tsconfig.json");
  const hasTsConfig = existsSync(tsConfigPath);

  const { output } = await cruise(
    targets,
    {
      baseDir: cwd,
      // 型のみの import も依存として拾う
      tsPreCompilationDeps: true,
      doNotFollow: { path: "node_modules" },
      exclude: { path: "node_modules" },
      ...(hasTsConfig ? { tsConfig: { fileName: tsConfigPath } } : {}),
    },
    {},
    hasTsConfig ? { tsConfig: extractTSConfig(tsConfigPath) } : {},
  );
  const result: ICruiseResult = typeof output === "string" ? JSON.parse(output) : output;

  return toGraphlerData(result, targets.join(" "));
}

function toGraphlerData(result: ICruiseResult, root: string): GraphlerData {
  // 試作ではプロジェクト内のモジュールだけを扱い、npm・組み込み・解決できなかったものは除く
  const localModules = result.modules.filter(
    (m) => !m.coreModule && !m.couldNotResolve && !m.source.includes("node_modules"),
  );
  const ids = new Set(localModules.map((m) => m.source));

  return {
    root,
    modules: localModules.map((m) => ({ id: m.source, path: m.source.split("/") })),
    dependencies: localModules.flatMap((m) =>
      m.dependencies
        .filter((d) => ids.has(d.resolved))
        .map((d) => ({ from: m.source, to: d.resolved, kinds: d.dependencyTypes })),
    ),
  };
}
