# graphler

Tool to visualize code dependencies as an interactive graph.

## Usage

```sh
npx @kawagh/graphler <dir>
```

## Development

```sh
pnpm install
pnpm build
node packages/cli/dist/index.js <dir>
```

開発でよく使う操作は [Task](https://taskfile.dev/) にまとめている。

```sh
task        # タスクの一覧を表示する
task check  # 書式・リント・型チェック・テストをまとめて実行する
```

### CHANGELOG

[git-cliff](https://git-cliff.org/) generates `CHANGELOG.md` from merged pull requests. Merge pull requests with a merge commit so that they appear in the changelog.

```sh
pnpm exec git-cliff -o CHANGELOG.md                  # unreleased changes go under "Unreleased"
pnpm exec git-cliff --tag <version> -o CHANGELOG.md  # on release
```

## License

MIT
