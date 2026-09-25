/** CLI が出力し、viewer が読み込む依存グラフのデータ */
export type GraphlerData = {
  /** 解析したディレクトリ */
  root: string;
  modules: GraphlerModule[];
  dependencies: GraphlerDependency[];
};

export type GraphlerModule = {
  /** root からの相対パス。例: "src/cli/index.ts" */
  id: string;
  /** id をディレクトリごとに分けたもの。例: ["src", "cli", "index.ts"]。viewer がグループを作るのに使う */
  path: string[];
};

export type GraphlerDependency = {
  /** 依存元のモジュールの id */
  from: string;
  /** 依存先のモジュールの id */
  to: string;
  /** 依存の種類。例: "import"、"type-only"、"dynamic-import" */
  kinds: string[];
};
