import type { GraphlerData } from "@graphler/schema";

declare global {
  interface Window {
    __GRAPHLER_DATA__?: GraphlerData;
  }
}

/** HTML に埋め込まれたデータがあればそれを使い、なければ graph.json を読む */
export async function loadData(): Promise<GraphlerData> {
  if (window.__GRAPHLER_DATA__) return window.__GRAPHLER_DATA__;
  const res = await fetch("graph.json");
  if (!res.ok) throw new Error(`graph.json を読み込めませんでした (${res.status})`);
  return res.json();
}
