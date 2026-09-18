# v0.21 → v0.22 更新手順

1. GitHub更新用ZIPを展開します。
2. 中身を、既存の `index.html` があるフォルダへそのまま上書きしてください。
3. 新規ファイル `js/data/balance22.js` と `tests/balance22_audit.test.js` も含めてアップロードしてください。
4. デプロイ後に再読み込みし、タイトルが v0.22 になったことを確認します。

v0.21以前のセーブは自動移行します。カードID・遺物ID・プロトコルIDは変更していないため、デッキ・装備・アンロックは保持されます。

検証：`bash tests/run_checks.sh` または `tests\run_checks.bat`
