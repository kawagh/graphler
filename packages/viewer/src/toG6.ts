import type { GraphData } from "@antv/g6";
import type { GraphlerData } from "@graphler/schema";

const dirId = (segments: string[]) => `dir:${segments.join("/")}`;

/** GraphlerData を G6 の形式に変換する。ディレクトリを combo にして入れ子で表す */
export function toG6(data: GraphlerData): GraphData {
  const combos = new Map<
    string,
    { id: string; combo?: string; data: { label: string }; style: { collapsed: boolean } }
  >();
  // 全モジュールに共通するディレクトリ(src など)だけを開き、その直下のフォルダから先は最初は畳んでおく。
  // 全体を見渡してから、見たいフォルダだけを開いていけるようにする
  const openDepth = commonDirDepth(data.modules.map((m) => m.path));

  for (const { path } of data.modules) {
    // ファイル名を除いたディレクトリの各階層を combo にする
    for (let depth = 1; depth < path.length; depth++) {
      const id = dirId(path.slice(0, depth));
      if (combos.has(id)) continue;
      combos.set(id, {
        id,
        combo: depth > 1 ? dirId(path.slice(0, depth - 1)) : undefined,
        data: { label: path[depth - 1] },
        style: { collapsed: depth > openDepth },
      });
    }
  }

  return {
    combos: [...combos.values()],
    nodes: data.modules.map(({ id, path }) => ({
      id,
      combo: path.length > 1 ? dirId(path.slice(0, -1)) : undefined,
      data: { label: path[path.length - 1] },
    })),
    edges: data.dependencies.map(({ from, to, kinds }) => ({
      id: `${from}->${to}`,
      source: from,
      target: to,
      data: { kinds },
    })),
  };
}

/** 全てのパスに共通する先頭ディレクトリの階層数 */
function commonDirDepth(paths: string[][]): number {
  if (paths.length === 0) return 0;
  const dirs = paths.map((p) => p.slice(0, -1));
  let depth = 0;
  while (dirs.every((d) => d.length > depth && d[depth] === dirs[0][depth])) depth++;
  return depth;
}
