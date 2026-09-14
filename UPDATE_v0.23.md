# BUILD LAB v0.23 更新手順

## GitHub / GitHub Pages
1. `build_lab_update_v0.22_to_v0.23.zip` を展開します。
2. 中身を現在のBUILD LABリポジトリ直下へコピーし、同名ファイルを上書きします。
3. `index.html` と `js/data/expansion23.js`、`js/data/unlocks23.js` がリポジトリへ入っていることを確認します。
4. GitHub Desktopで変更を確認し、例として `Update v0.23` でCommitします。
5. Push originします。GitHub Pagesはmain / root公開のままで構いません。

`index.html` はv0.23用キャッシュ識別子を付けているため、公開後は旧JS/CSSが混在しにくい構成です。今回の更新では、v0.22で読込漏れしていた `js/data/balance22.js` も `index.html` から正式に読み込むよう修正しています。

## セーブ
セーブキーはv23です。v22以前のセーブを自動移行します。カード・装備・アンロック・元素/錬成設定・ルーン/アルカナなど既存IDは維持しています。

## ローカル確認
`index.html` をブラウザで開いて遊べます。Node.jsがある場合は、プロジェクト直下で次を実行すると自動検査できます。

```bash
bash tests/run_checks.sh
```

Windowsでは `tests\run_checks.bat` でも同じv0.23検査を実行できます。
