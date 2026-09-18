# BUILD LAB v0.30 → v0.32 更新手順

前回のv0.26→v0.30更新ZIPは、ZIPルートと完全版フォルダの階層が異なっていたため、展開場所によっては本体へ上書きされない問題がありました。v0.32では用途別にZIPを分けています。

## ローカル上書き用ZIP
`build_lab_update_v0.30_to_v0.32_LOCAL_FIXED.zip`

1. 現在の `build_lab_v030` フォルダをバックアップします。
2. `build_lab_v030` フォルダが見えている「1つ上のフォルダ」でZIPを展開します。
3. 同名ファイルの上書きを許可します。
4. `build_lab_v030/index.html` を開き、タイトルが v0.32 になっていることを確認します。

このZIPは先頭に `build_lab_v030/` を含むため、既存の完全版フォルダへ正しく重なります。

## GitHubリポジトリ直下用ZIP
`build_lab_update_v0.30_to_v0.32_GITHUB.zip`

GitHub上で `index.html` / `js/` / `tests/` がリポジトリ直下にある場合はこちらを使います。ZIPの中身をリポジトリ直下へ上書きしてください。

## 完全版
`build_lab_v0.32_complete.zip` は新しい場所へ展開して使用できます。

## セーブデータ
v0.32は `build_lab_proto_v32` を使用します。`build_lab_proto_v30` を含む旧セーブを自動検出して移行し、旧キーは削除しません。
