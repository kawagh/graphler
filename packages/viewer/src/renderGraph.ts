/** 描画できるグラフ。G6 の Graph のうち、ここで使うものだけ */
export type RenderableGraph = {
  render(): Promise<void>;
  destroy(): void;
};

/**
 * グラフを作って描画する。作成か描画に失敗したら、グラフを片付けて onError に渡す。
 * 返す関数でグラフを片付ける。片付けた後に届いた描画の失敗は無視する
 */
export function renderGraph(
  create: () => RenderableGraph,
  onError: (e: unknown) => void,
): () => void {
  let graph: RenderableGraph | undefined;
  let disposed = false;
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    graph?.destroy();
  };
  const fail = (e: unknown) => {
    if (disposed) return;
    onError(e);
    dispose();
  };
  try {
    graph = create();
    graph.render().catch(fail);
  } catch (e) {
    fail(e);
  }
  return dispose;
}
