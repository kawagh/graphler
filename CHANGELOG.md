# Changelog

## [0.1.1](https://github.com/kawagh/graphler/compare/0.1.0...0.1.1) (2026-09-25)

- fix(cli): 同じモジュールを複数行で import したときの依存を1本にまとめる ([#2](https://github.com/kawagh/graphler/pull/2))
- ci: GitHub Actions でビルド・型チェック・リント・テストを実行する ([#11](https://github.com/kawagh/graphler/pull/11))
- build: oxfmt を導入して書式をそろえる ([#12](https://github.com/kawagh/graphler/pull/12))
- feat(cli): --version でバージョンを表示する ([#7](https://github.com/kawagh/graphler/pull/7))
- chore: Issue と PR のテンプレートを追加する ([#5](https://github.com/kawagh/graphler/pull/5))
- fix(viewer): グラフの描画に失敗したら画面を真っ白にせずエラーを表示する ([#4](https://github.com/kawagh/graphler/pull/4))
- chore: taskfile を追加して開発の操作をまとめる ([#14](https://github.com/kawagh/graphler/pull/14))
- build: git-cliff で CHANGELOG.md を生成する ([#16](https://github.com/kawagh/graphler/pull/16))

## [0.1.0](https://github.com/kawagh/graphler/releases/tag/0.1.0) (2026-09-25)

- init: pnpm init
- chore: ルートの package.json を private にする
- chore: create 3 packages (cli,schema,viewer)
- chore: add .gitignore
- chore: パッケージ名を公開用と内部用に分けて設定する
- build(cli): dependency-cruiser と typescript を依存に追加する
- build(cli): schema と viewer と @types/node を開発依存に追加する
- build(viewer): G6 を依存に追加する
- build(viewer): schema を開発依存に追加する
- chore: ライセンスを MIT にする
- build(viewer): ビルド時に同梱ライブラリのライセンス一覧を出力する
- build: 実装前のビルド設定を整える
- docs: add empty README.md
- feat(schema): CLI と viewer の境界になる GraphlerData の型を定義する
- feat(cli): dependency-cruiser で依存関係を抽出して JSON で出力する
- feat(viewer): 依存グラフを G6 で描画する
- feat(cli): viewer を同梱して配信し、ブラウザでグラフを開く
- chore: ビルド結果の dist/ を git の管理対象から外す
- docs: README にツールの概要を1行で書く
- build(cli): npm 公開に向けて package.json を整える
- docs: README に使い方と開発手順を書く
- fix(cli): ビルド前に dist を消して古い成果物を同梱しないようにする
- build(cli): npm のパッケージ名を @kawagh/graphler にする

