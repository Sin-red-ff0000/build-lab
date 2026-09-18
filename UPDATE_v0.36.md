# BUILD LAB v0.32 → v0.36 更新手順

## GitHub
`build_lab_update_v0.32_to_v0.36_GITHUB.zip` の中身を、`index.html` が存在するリポジトリ直下へ上書きしてください。GitHub Pages反映後、画面上部とブラウザタイトルの両方が **v0.36** なら更新成功です。

## ローカル
`build_lab_update_v0.32_to_v0.36_LOCAL_FIXED.zip` は `build_lab_v032/` フォルダを含みます。既存の `build_lab_v032` が見えている親フォルダで展開し、上書きを許可してください。

## セーブ
v0.36は `build_lab_proto_v36` を使用し、`build_lab_proto_v32` を含む旧キーを自動移行対象として保持します。

## 確認
`tests/run_checks.bat` または `tests/run_checks.sh` を実行し、`All checks passed.` を確認してください。
