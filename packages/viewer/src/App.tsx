import { useEffect, useRef, useState } from "react";
import { Graph, type EdgeData, type NodeData } from "@antv/g6";
import type { GraphlerData } from "@graphler/schema";
import { loadData } from "./load";
import { renderGraph } from "./renderGraph";
import { toG6 } from "./toG6";

const label = (d: { data?: Record<string, unknown> }) => String(d.data?.label ?? "");
const kinds = (d: EdgeData) => (d.data?.kinds as string[] | undefined) ?? [];

function edgeColor(d: EdgeData): string {
  if (kinds(d).includes("dynamic-import")) return "#f59e0b";
  if (kinds(d).includes("type-only")) return "#9ca3af";
  return "#64748b";
}

function createGraph(container: HTMLElement, data: GraphlerData): Graph {
  return new Graph({
    container,
    autoFit: "view",
    data: toG6(data),
    node: {
      type: "rect",
      style: {
        size: (d: NodeData) => [Math.max(80, label(d).length * 7 + 24), 28],
        radius: 6,
        fill: "#ffffff",
        stroke: "#3b82f6",
        lineWidth: 1.5,
        labelText: label,
        labelPlacement: "center",
        labelFontSize: 12,
      },
    },
    combo: {
      type: "rect",
      style: {
        radius: 8,
        padding: 16,
        fill: "#3b82f6",
        fillOpacity: 0.04,
        stroke: "#93c5fd",
        labelText: label,
        labelPlacement: "top",
        labelFontWeight: 600,
        collapsedMarker: true,
      },
    },
    edge: {
      type: "cubic-horizontal",
      style: {
        stroke: edgeColor,
        lineDash: (d: EdgeData) => (kinds(d).includes("type-only") ? [4, 4] : [0]),
        endArrow: true,
      },
    },
    layout: { type: "antv-dagre", rankdir: "LR", nodesep: 10, ranksep: 70, sortByCombo: true },
    behaviors: [
      "drag-canvas",
      "zoom-canvas",
      "drag-element",
      { type: "collapse-expand", trigger: "dblclick" },
      { type: "hover-activate", degree: 1 },
    ],
    plugins: [
      {
        type: "tooltip",
        getContent: (_: unknown, items: { id: string }[]) => Promise.resolve(items[0]?.id ?? ""),
      },
    ],
  });
}

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<GraphlerData>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    loadData().then(setData, (e: unknown) => setError(String(e)));
  }, []);

  useEffect(() => {
    if (!data || !containerRef.current) return;
    const container = containerRef.current;
    return renderGraph(
      () => createGraph(container, data),
      (e) => setError(`Failed to render the graph: ${String(e)}`),
    );
  }, [data]);

  return (
    <div className="app">
      <header className="toolbar">
        <strong>graphler</strong>
        {data && (
          <span>
            {data.root} — {data.modules.length} modules, {data.dependencies.length} dependencies
          </span>
        )}
        <span className="hint">Double-click a folder to collapse or expand it</span>
      </header>
      {error ? <p className="error">{error}</p> : <div ref={containerRef} className="graph" />}
    </div>
  );
}
