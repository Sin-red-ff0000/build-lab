# BUILD LAB v0.19 CODE TREE

```text
build_lab_v19/
├─ index.html
├─ README.md
├─ CHANGELOG.md
├─ CODE_TREE.md
├─ styles/
│  ├─ base.css
│  ├─ layout.css
│  ├─ components.css
│  └─ mobile.css              # v0.14 スマホUI v2
├─ js/
│  ├─ app.js
│  ├─ data/
│  │  ├─ gameData.js
│  │  ├─ protocols.js
│  │  ├─ tunings.js
│  │  ├─ conversions.js
│  │  ├─ chapter3.js
│  │  ├─ expansion08.js
│  │  ├─ expansion09.js
│  │  ├─ doctrines.js
│  │  ├─ characterStyles.js
│  │  ├─ expansion10.js
│  │  ├─ expansion11.js
│  │  ├─ expansion12.js
│  │  ├─ enemyBehaviors.js
│  │  ├─ expansion13.js
│  │  ├─ expansion14.js       # v0.14 カード/遺物/プロトコル
│  │  ├─ expansion17.js       # v0.17 既存6軸の追加カード/遺物/プロトコル
│  │  ├─ expansion18.js       # v0.18 研究V・橋渡しカード/遺物/プロトコル
│  │  ├─ expansion19.js       # v0.19 キャラ/スタイル/遺物/プロトコル/調律/特殊個体/複合挙動
│  │  ├─ guides.js            # v0.16 解説データ + 実データ由来リファレンス
│  │  ├─ unlocks.js
│  │  ├─ unlocks07.js
│  │  ├─ unlocks08.js
│  │  ├─ unlocks09.js
│  │  ├─ unlocks10.js
│  │  ├─ unlocks11.js
│  │  ├─ unlocks12.js
│  │  ├─ unlocks13.js
│  │  ├─ unlocks14.js         # v0.14追加アンロック
│  │  ├─ unlocks17.js         # v0.17追加アンロック
│  │  ├─ unlocks18.js         # v0.18追加アンロック
│  │  └─ unlocks19.js         # v0.19大量追加要素のアンロック
│  ├─ core/
│  │  ├─ utils.js
│  │  ├─ unlock.js
│  │  ├─ state.js             # v19セーブ / 旧版移行 / 個別・総合リセット / モバイル状態
│  │  ├─ enemy.js             # v19データ駆動特殊個体の発見/補正

│  │  └─ battle.js            # 既存ルール + v19汎用条件ルール接続
│  └─ ui/
│     ├─ tabs.js              # スマホクローム更新フック
│     ├─ deckView.js          # スマホ段階表示
│     ├─ styleView.js
│     ├─ tuningView.js
│     ├─ conversionView.js
│     ├─ linkView.js
│     ├─ doctrineView.js
│     ├─ experimentView.js
│     ├─ battleView.js        # タッチ操作 / ページャー
│     ├─ metaView.js
│     ├─ guideView.js         # v0.16 解説検索 / 詳細一覧 / WEB読込エラー案内
│     └─ mobile.js            # v0.14モバイル操作統合
└─ tests/
   ├─ smoke.test.js
   ├─ content_balance.test.js
   ├─ effect_coverage.test.js
   ├─ boss_balance.test.js
   ├─ boss2_balance.test.js
   ├─ boss3_balance.test.js
   ├─ boss_reward_integration.test.js
   ├─ chapter2_systems.test.js
   ├─ chapter3_systems.test.js
   ├─ expansion08_systems.test.js
   ├─ expansion09_systems.test.js
   ├─ expansion10_systems.test.js
   ├─ expansion11_systems.test.js
   ├─ expansion12_systems.test.js
   ├─ expansion13_systems.test.js
   ├─ expansion14_systems.test.js # v0.14追加要素/移行
   ├─ expansion17_systems.test.js # v0.17追加要素/移行
   ├─ expansion18_systems.test.js # v0.18追加要素/移行
   ├─ expansion19_systems.test.js # v0.19大量追加要素/移行
   ├─ reset_controls.test.js      # 個別/総合/全データリセット
   ├─ modal_overflow.test.js      # 大量アンロック結果モーダル回帰
   ├─ static_ui.test.js
   ├─ mobile_ui.test.js           # スマホUI検査
   ├─ system_guide.test.js        # システム解説基本検査
   ├─ guide_detail.test.js        # 個別解説と実データ件数の整合性
   ├─ web_deploy.test.js          # WEBキャッシュ/移行/独立描画
   ├─ run_checks.sh
   └─ run_checks.bat
```

## v0.14責務分離
- `expansion14.js` は追加カード・遺物・プロトコルと、それらのデータ駆動ルールのみ保持。
- `unlocks14.js` はv0.14の達成条件と報酬のみ保持。
- スマホの見た目は `mobile.css`、操作補助は `mobile.js`、戦闘中のタッチカード操作は `battleView.js` に分離。
- 長大リストの段階表示は `deckView.js`、件数状態は `state.js` に保持。

## v0.14追加テスト
- +30カード / +14遺物 / +8プロトコル
- v0.13→v0.14セーブ移行
- v0.14追加アンロック経路
- v0.14遺物・プロトコル実戦接続
- スマホヘッダーメニュー
- 実験クイックドック
- 戦闘ページャー
- タッチ中央交換 / 再提示
- カード/遺物段階表示
- フィルター条件数 / 一括解除
- 横画面ルール


## v0.15 追加
- `js/data/guides.js` — システム解説データを一元管理
- `js/ui/guideView.js` — 解説検索・カテゴリ・クイックリンク描画
- `tests/system_guide.test.js` — 解説項目・UI・必須項目の回帰検査


## v0.16 追加責務
- `guides.js` は解説本文だけでなく、調律・役割変換・スタイル等の実データから詳細リファレンスを自動生成。
- `guideView.js` は個別リファレンスの検索・自動展開・読込失敗時フォールバックを担当。
- `app.js` は各画面を個別 `safeRender` し、1画面の例外で全UIが停止しないよう変更。解説を最初に描画。
- `index.html` は全CSS/JSへバージョンクエリを付け、GitHub Pages等で旧キャッシュと新HTMLが混ざる事故を防止。
- `state.js` はv16キーへ移行し、v15以前を順次探索。


## v0.17 追加責務
- `expansion17.js` は既存6ビルド軸の追加カード24種・遺物12種・プロトコル6種を保持。
- `unlocks17.js` は「研究 IV」6件と複合軸6件の解放条件のみを保持。
- `components.css` / `mobile.css` はモーダルを「固定シェル + スクロール本文 + 固定フッター」に分離。
- `app.js` はモーダル表示時のスクロール初期化・フォーカス・背景タップ/Esc終了を担当。
- `modal_overflow.test.js` でアンロック件数に依存せず閉じられるDOM/CSS構造を固定。


## v0.18 追加責務
- `state.js` に進行を保持する個別リセットと `resetBuild()` を集約。全データ初期化 `reset()` と明確に分離。
- `app.js` は静的リセットボタンの確認ダイアログ・再描画・戦闘中断を統括。
- `expansion18.js` は研究Vと既存システム橋渡し用のカード24種・遺物12種・プロトコル6種を保持。
- `unlocks18.js` は研究V6件＋スタイル/調律/変換/連結/規格/複合挙動の応用6件を保持。
- `reset_controls.test.js` で「構成リセットは進行を消さない」ことを固定。


## v0.19 追加責務
- `expansion19.js` は新キャラクター8体、スタイル24種、遺物40種、プロトコル20種、調律12種、特殊個体12種、複合挙動20種と、それらのデータ駆動ルールを保持。
- `unlocks19.js` は新キャラ・スタイル・調律・特殊個体攻略のアンロック32件を保持。新複合挙動20種の発見目標は既存 `unlocks12.js` のデータ駆動ループから自動生成され、v0.19全体では、特殊個体発見12件を含め目標が64件増える。
- `battle.js` のv19汎用ルール層は、調律/変換/タグ数/敵特性/敵挙動/位置/連結/循環/低HP/状態異常/捨て履歴/強化状態/提示枚数/反復などを共通条件として解釈。
- `enemy.js` は `V19_TRAIT_CONDITIONS` / `V19_TRAIT_RULES` を参照し、追加特殊個体の発見とステータス補正を個別switchなしで処理。
- `guides.js` は追加された24調律・38スタイル・53特殊個体・36複合挙動を実データから自動反映。
- `expansion19_systems.test.js` は追加数、孤立アンロック、特殊個体/複合挙動発見、調律実戦接続、v18→v19移行を固定。
