import assert from "node:assert/strict";
import { test } from "node:test";
import { renderGraph, type RenderableGraph } from "../src/renderGraph.ts";

/** render の結果を外から決められる偽のグラフ。destroy した回数を数える */
function fakeGraph() {
  let settle!: { resolve: () => void; reject: (e: unknown) => void };
  const rendered = new Promise<void>((resolve, reject) => (settle = { resolve, reject }));
  const graph = {
    destroyed: 0,
    render: () => rendered,
    destroy: () => void graph.destroyed++,
  } satisfies RenderableGraph & { destroyed: number };
  return { graph, ...settle };
}

/** 待っている Promise の後続処理を走らせる */
const flush = () => new Promise((resolve) => setImmediate(resolve));

test("グラフの作成で例外が出たら onError に渡す", () => {
  const errors: unknown[] = [];
  const error = new Error("Edge already exists");

  renderGraph(
    () => {
      throw error;
    },
    (e) => errors.push(e),
  );

  assert.deepEqual(errors, [error]);
});

test("描画が reject したら onError に渡し、グラフを片付ける", async () => {
  const { graph, reject } = fakeGraph();
  const errors: unknown[] = [];
  const error = new Error("Edge already exists");

  const dispose = renderGraph(
    () => graph,
    (e) => errors.push(e),
  );
  reject(error);
  await flush();

  assert.deepEqual(errors, [error]);
  assert.equal(graph.destroyed, 1);
  // 失敗で片付け済みなので、後片付けを呼んでも二重に destroy しない
  dispose();
  assert.equal(graph.destroyed, 1);
});

test("描画に成功したら onError を呼ばず、後片付けでグラフを1度だけ片付ける", async () => {
  const { graph, resolve } = fakeGraph();
  const errors: unknown[] = [];

  const dispose = renderGraph(
    () => graph,
    (e) => errors.push(e),
  );
  resolve();
  await flush();
  dispose();
  dispose();

  assert.deepEqual(errors, []);
  assert.equal(graph.destroyed, 1);
});

test("後片付けの後に描画が reject しても onError を呼ばない", async () => {
  // StrictMode で effect が2回走ると、1回目のグラフは描画の途中で片付けられる
  const { graph, reject } = fakeGraph();
  const errors: unknown[] = [];

  const dispose = renderGraph(
    () => graph,
    (e) => errors.push(e),
  );
  dispose();
  reject(new Error("destroyed while rendering"));
  await flush();

  assert.deepEqual(errors, []);
  assert.equal(graph.destroyed, 1);
});
