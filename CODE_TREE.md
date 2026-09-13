# BUILD LAB v0.15 CODE TREE

```text
build_lab_v15/
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
│  │  ├─ guides.js            # v0.15 システム解説データ
│  │  ├─ unlocks.js
│  │  ├─ unlocks07.js
│  │  ├─ unlocks08.js
│  │  ├─ unlocks09.js
│  │  ├─ unlocks10.js
│  │  ├─ unlocks11.js
│  │  ├─ unlocks12.js
│  │  ├─ unlocks13.js
│  │  └─ unlocks14.js         # v0.14追加アンロック
│  ├─ core/
│  │  ├─ utils.js
│  │  ├─ unlock.js
│  │  ├─ state.js             # v15セーブ / 旧セーブ移行 / モバイル段階表示状態
│  │  ├─ enemy.js
│  │  └─ battle.js            # v14遺物/プロトコル規則接続
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
│     ├─ guideView.js         # v0.15 解説検索/描画
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
   ├─ static_ui.test.js
   ├─ mobile_ui.test.js           # スマホUI検査
   ├─ system_guide.test.js        # v0.15システム解説検査
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
