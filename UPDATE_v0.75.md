# BUILD LAB v0.36 → v0.75 更新手順

## GitHub更新用

`BUILD_LAB_v075_GITHUB_UPDATE.zip` を展開し、**中身を `index.html` があるリポジトリ直下へ上書き**してください。

GitHub Pages反映後、画面上部とブラウザタイトルが **v0.75** なら更新成功です。

## 完全版

`BUILD_LAB_v075_COMPLETE.zip` はv0.75の全ファイル入りです。新規配置・バックアップ・環境の作り直しにはこちらを使用してください。

## セーブデータ

v0.75は `build_lab_proto_v75` を使用します。v0.36を含む旧セーブを自動検出して移行します。更新前のブラウザデータを消す必要はありません。

## 更新後の確認

macOS / Linux:

```bash
bash tests/run_checks.sh
```

Windows:

```bat
tests\run_checks.bat
```

正常時は最後に `All checks passed. (84 tests)` と表示されます。

## 注意

v0.59～v0.75の `FINAL_FIX` / `AUDIT` 文書は開発監査記録です。ゲームの通常プレイには不要ですが、完全版には最終設計判断を追跡できるよう主要記録を残しています。
