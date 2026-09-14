# BUILD LAB v0.25 更新手順

## GitHub更新
1. `build_lab_update_v0.24_to_v0.25.zip` を展開。
2. 中身を既存のBUILD LABリポジトリへそのまま上書き。
3. GitHub Desktopで変更を確認し、Commit。
4. Summary例：`Update BUILD LAB v0.25`
5. Push origin。

`index.html` のCSS/JS参照は `?v=0.25.0` に更新済みです。GitHub Pagesでも旧キャッシュが混ざりにくくなっています。

## セーブ
セーブキーは `build_lab_proto_v25`。v24以前のキーを自動探索して移行します。デッキ、アンロック、錬成、ルーン、アルカナ、敵設定などはそのまま引き継がれます。

## 新しい操作
- デッキ → デッキ構築 → **カード全解除**：デッキだけ0枚にする。
- 実験場 → 特殊個体 → **個体を全解除**：敵ステータスはそのまま、特殊個体だけOFFにする。
