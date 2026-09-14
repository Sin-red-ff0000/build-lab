# v0.25 変更責務

- `index.html`：デッキ構築に `deckClearBtn`、特殊個体画面に `enemyTraitsClearBtn` を追加。WEBキャッシュ識別子をv0.25へ更新。
- `js/core/state.js`：`clearDeck()` と `resetEnemyTraits()` を追加。セーブキーをv25へ更新し、v24以前から自動移行。
- `js/app.js`：2つの全解除操作を既存の共通リセット処理へ接続。カード全解除のみ誤操作防止の確認ダイアログを表示。
- `tests/reset_controls.test.js`：カード付随設定・進行保持、敵ステータス保持、UIボタン存在を回帰検査。
- `tests/web_deploy.test.js`：v0.25キャッシュ識別子とv25セーブキーを検査。

# v0.24 追加ファイル / 変更責務

- `js/data/alchemy24.js`：上位錬成物12種、上位レシピ12種、各自動効果、錬成解説への追加。
- `js/data/expansion24.js`：錬成物系キャラ5体、スタイル15種、遺物30種、プロトコル15種、調律10種、特殊個体10種、複合挙動20種。
- `js/data/unlocks24.js`：第7章アンロック60件。上位錬成物生成、多反応、消費回転、大錬成を解放条件化。
- `js/core/alchemy.js`：攻撃後自動発動するダメージ錬成物をデータ駆動で処理。
- `js/core/battle.js`：錬成物の消費履歴、生成/消費/在庫種類数、反応種類数、上位錬成物種類数を汎用条件へ追加。v0.24キャラ/スタイル/遺物/プロトコル/調律を接続。
- `js/core/enemy.js`：v0.24特殊個体の発見条件・補正を接続。
- `js/core/state.js`：v24セーブキー、v23以前からの自動移行。
- `tests/expansion24_systems.test.js`：追加件数、多段上位錬成、v23→v24移行、追加要素の実戦接続、特殊個体、全アンロック経路を検査。
- `tests/effect_coverage.test.js`：v0.24データ駆動ルールを接続監査へ追加。
- `tests/web_deploy.test.js`：v0.24キャッシュ識別子・データ読込・セーブキーを検査。
- `NEXT_SYSTEM_IDEAS.md`：次の大型新システム候補。今回は未実装。

# v0.23 追加ファイル / 変更責務

- `js/data/expansion23.js`：五元素ヘルパー、元素ルーン5種、キャラ5体、スタイル15種、遺物30種、プロトコル15種、調律10種、特殊個体10種、複合挙動20種、データ駆動ルール、元素ビルド解説。
- `js/data/unlocks23.js`：第6章の可視アンロック60件。元素ルーン→キャラ/装備→スタイル/調律→敵試験と、元素間反応遺物の経路を定義。
- `js/core/battle.js`：元素配分、優勢元素、元素多様性、カード元素、錬成物生成/在庫/反応回数を汎用条件マッチャーへ追加。v0.23キャラ/スタイル/遺物/プロトコル/調律を戦闘倍率へ接続。
- `js/core/enemy.js`：v0.23特殊個体の発見条件とデータ駆動補正を接続。
- `js/core/state.js`：v23セーブキーとv22以前からの自動移行。
- `index.html`：v0.23キャッシュ識別子、第6章フィルター、`balance22.js` / `expansion23.js` / `unlocks23.js` の正式読込。
- `tests/expansion23_systems.test.js`：追加件数、v22→v23移行、元素ルーン/キャラの実戦効果、特殊個体・複合挙動、全追加要素のアンロック到達性、追加装備系の実戦スモークを検査。
- `tests/effect_coverage.test.js`：v0.23データ駆動ルールを効果接続監査へ追加。
- `tests/web_deploy.test.js`：v0.23キャッシュ、セーブキー、v0.22補正レイヤーおよびv0.23データ読込を検査。
- `tests/run_checks.sh` / `tests/run_checks.bat`：v0.23回帰テストを通常検査へ追加。

# v0.22 追加ファイル / 変更責務

- `js/data/balance22.js`：既存IDを維持したままカード・遺物・プロトコルの役割分岐を上書き
- `js/core/battle.js`：v0.22の使用後ルート、毒専用条件、次カード強化、追加遺物条件を接続
- `tests/balance22_audit.test.js`：455カード / 305遺物 / 113プロトコルの監査数、完全同効果0件、代表分岐を固定
- `js/core/state.js`：v22セーブキー。v21以前を自動移行

# v0.21 追加ファイル

- js/data/alchemy.js：元素・材料・15レシピ・効果・プリセット・正規化・解説
- js/core/alchemy.js：スタック・自動反応・優先確保・遅延・自動使用
- js/ui/alchemyView.js：配分・工程・備蓄・実験結果
- tests/alchemy.test.js：錬成と既存戦闘の統合検証

# BUILD LAB v0.20 CODE TREE

```text
build_lab_v20/
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
│  │  ├─ runes.js             # v0.20 ルーン12種
│  │  ├─ arcana.js            # v0.20 アルカナ12種（正位置/逆位置）
│  │  ├─ expansion20.js       # v0.20 キャラ/スタイル/遺物/プロトコル/調律/敵側拡張
│  │  ├─ guides20.js          # v0.20 ルーン/アルカナ解説
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
│  │  ├─ unlocks19.js         # v0.19大量追加要素のアンロック
│  │  └─ unlocks20.js         # v0.20 第4ボス/ルーン/アルカナ/追加要素
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
│     ├─ runeView.js          # v0.20 ルーン管理UI
│     ├─ arcanaView.js        # v0.20 アルカナ管理UI
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
   ├─ expansion20_systems.test.js # v0.20大量追加要素/移行
   ├─ boss4_balance.test.js       # 第4ボス複数ビルド突破率
   ├─ boss4_reward_integration.test.js # ルーン/アルカナ報酬統合
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


## v0.20 追加責務
- `runes.js` — ルーン12種の定義。カード種類単位の追加強化。
- `arcana.js` — アルカナ12種と正位置 / 逆位置効果の定義。
- `expansion20.js` — 新キャラ6体、18スタイル、30遺物、15プロトコル、8調律、8特殊個体、12複合挙動を集約。
- `unlocks20.js` — 第4ボス、ルーン / アルカナ、新キャラ・スタイル・調律・特殊個体の第5章アンロックを定義。
- `guides20.js` — ルーン / アルカナのシステム解説と全種類リファレンス。
- `runeView.js` — 最大3カードへのルーン設定、検索、絞り込み。
- `arcanaView.js` — アルカナ1枚の選択、正位置 / 逆位置切替、検索。
- `battle.js` — 第4ボス適応ギミック、ルーン倍率、アルカナ倍率、v0.20キャラ/スタイル汎用ルールを接続。
- `state.js` — v20セーブ、ルーン / アルカナ状態、旧セーブ移行、構成リセットを担当。
- `boss4_balance.test.js` / `boss4_reward_integration.test.js` / `expansion20_systems.test.js` — 第4ボスと新システムの回帰を固定。
