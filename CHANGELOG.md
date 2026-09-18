# CHANGELOG

## v0.75 — 正式リリース / 最終全件監査PASS
- v0.49〜v0.58の10段階ロードマップを統合。共通イベント、新カード機構、二面カード、新キャラクター/スタイル、カード・遺物・プロトコル・調律、章進行、エンドコンテンツを全面改修。
- v0.59〜v0.75でカード品質・実戦探索・複数シード監査・監査器の構築バイアスを段階的に修正。
- 177/177構成に最低1つの公式校正で実勝利経路を確認。
- 完成阻害級4条件をすべて解消し、最終全件監査PASS。
- 表示バージョンとセーブキーを正式にv0.75へ更新。v0.36を含む旧セーブの移行を維持。
- テストランナーを `tests/*.test.js` 全件自動検出方式へ変更。正式版で84/84 PASS。

## v0.36 — 全スタイル終盤校正 / 章進行再設計 / バージョン表示修正

- 全141キャラクター・スタイル構成のエンドコンテンツ撃破検証を追加。
- 既存6ビルドをカード36・遺物36で大幅強化。
- 追加8ビルドへカード48・遺物48を追加し、14軸すべて各6候補以上を保証。
- 初期プールと章別アンロック報酬を再配置。
- 全域校正など後半目標を適切な章へ移動。
- 章ごとの新規システムを使わない力押しを抑え、利用時の突破性を検証。
- `PROTOTYPE 0.26` 残存表示を削除し、`js/version.js` を単一の版数ソースとして追加。
- `version_consistency.test.js` を標準回帰へ追加。

## v0.32 — 分岐成長 / 更新パッケージ修正
- 分岐成長カード6種を追加。第2段階から2種類の最終形へ分岐。
- 分岐はUID単位で固定され、条件が変化しても別枝へ乗り換えない。
- 分岐成長向け遺物6 / プロトコル3 / 調律3を追加。
- 戦闘画面に確定分岐を表示。
- Windows回帰スクリプトにv0.30 / v0.31 / v0.32専用テストを追加。
- セーブキーを build_lab_proto_v32 へ更新し、v0.30以前からの移行を維持。
- 更新ZIPをローカル上書き用とGitHub直下用に分離し、階層不一致を解消。

## v0.31 — 選択成長
- 第2段階を維持する理由がある選択成長カード6種を追加。
- 第2段階向け / 第3段階向けの支援遺物・プロトコル・調律を追加。
- 成長方針と維持可能状態を戦闘表示へ追加。

## v0.30 — 複合解析 / 3段階成長カード
- 複合解析カードとUID単位3段階成長カードを追加。
- 解析・二面カード・横断シナジー拡張を統合。

### Working v0.49 — Roadmap 1/10: Common battle events
- Added shared battle event history with global/per-card-instance counters and recent event records.
- Wired prompt lifecycle: presented / selected / notChosen / used.
- Wired combat lifecycle: reshuffle / HP changes / status application / enemy actions.
- Exposed Battle.emitEvent(), Battle.eventCount(), Battle.recentEvents() for later mechanics.
- Added events49_core.test.js. No card power increase in this pass.

### Working v0.50 — Roadmap 2/10: Vanish / Not Chosen / While Presented
- Added a true `vanished` battle pile that is not returned by normal reshuffles.
- Added `vanished` / `returnedFromVanish` / `whilePresented` event usage on the v0.49 shared event layer.
- Added per-instance non-selection scaling via `eventCount('notChosen', uid)`.
- Added small while-presented passive effects; these create value before a card is selected rather than adding raw selected-card multipliers.
- Added 9 post-boss cards across Vanish, Not Chosen, and While Presented roles.
- Added mechanics50_vanish_notchosen_presented.test.js and updated count audits to 658 cards.
- Normal regression reaches the intentionally unresolved legacy expansion34 extreme-build check; no large-number cards were restored to satisfy it.

## Working v0.52 — Roadmap 4/10
- 二面カード12種追加（総数28）。非選択、消失復帰、予約、位置、HP変動、状態異常、連結、循環、記録、敵行動を変身条件へ接続。
- 表裏を同じ能力の強弱ではなく、役割転換として設計。
- 解放4系統と `dual52_roles.test.js` を追加。

## Working checkpoint v0.53 / Roadmap 5 of 10
- 学習結果を正式ビルドへ昇格。新キャラクター6種（ヴァニッシャー / ウォッチャー / スクライブ / プロヴォーカー / リバーサー / モーフ）を追加。
- 各3スタイル、計18スタイルを追加。消失・非選択/提示中・記録/再現・敵行動利用・デメリット反転・変質/二面を独立した採用判断へ。
- 補正は原則4〜8%、最大12%以下。巨大倍率ではなく防御+1〜3や次行動+6%などの横利益を中心にした。
- 6系統の可視アンロック条件を追加。第4ボス後に該当メカニクスを実際に運用して勝利することで解放。

### Working v0.54 — Roadmap 6/10: カード全件再設計・前半
- 初期〜第1章周辺を中心に既存51カードを再設計。単純な数値差を、非選択/単発重撃/循環/状態異常分化/敵行動利用/復帰などの役割差へ置換。
- `rebuild` の汎用次カード強化を35%級から12%へ、再構築イベント自体を主役へ戻した。
- `wheel_cut` / `cycle_guard` の再構築回数による直線的な数値成長を1回+2へ抑制。
- `brink_blast` 等の瀕死時巨大値を正常化し、単発攻撃への橋渡しへ変更。
- 毒/火傷/出血/凍傷は個別タグを維持しつつ、既存進行互換のため状態異常総称タグも保持。
- `damageIfNotChosen` / `hitsIfPromptMin` / 条件付き自己予約 / 敵挙動時追加状態異常を戦闘エンジンへ追加し、本文だけの未実装効果にしない。
- `balance54_cards_front.test.js` 追加。51枚の無条件巨大値禁止と役割分布を固定。
- 実ロード後のカード679定義で完全同一説明0件を確認。監査結果は `AUDIT_v0.54_CARD_FRONT.json`。

## v0.55 working checkpoint — Roadmap 7/10
- v0.35後半カード48枚を全件再設計。8系列×6枚。
- 旧 `V35_CARD_RULES` の1.5〜1.7倍級カード固有倍率を撤去し、条件未達でも高効率・条件達成でさらに万能化する構造を解体。
- 元素5系統を火傷/予約/回復循環/防御列/異軸接続へ分離。解析は敵行動・出血、錬成は在庫/反応/消費などへ役割分離。
- `balance55_cards_back.test.js` 追加。48枚、8系列各6、無条件巨大値禁止を固定。
- `AUDIT_v0.55_CARD_BACK.json`: 679 cards / 48 redesigned / duplicate descriptions 0。
- 全65テスト個別実行: 62 PASS、既知3 FAILのみ。

## Working roadmap 8/10 — v0.56 system ecology normalization
- Relics 507 / protocols 175 / tunings 82 were loaded and audited as one system pool (764 definitions total).
- 569 late-expansion rule payoffs above the new horizontal band were normalized to max +12%; miss-side penalties are floored at -12% for these rule maps.
- Every relic/protocol/tuning now receives a v0.56 role classification: selection/prompt, cycle/return, ailment, HP history, link history, defense, role conversion, resource process, or conditional choice.
- Old expansion28 tests were migrated from the superseded "harder condition must pay +50–70%" doctrine to the v0.56 horizontal cap.
- No card damage inflation was restored. Known red tests remain the legacy boss3 chapter calibration, fixed 141-style count, and old numeric extreme test.

## v0.57-working — Roadmap 9/10
- Chapter curriculum recalibrated around learned systems instead of raw-stat walls.
- Boss3 no longer requires Apex; Boss4 no longer requires v19 Omega.
- Boss4 now requires practical mastery of compact/expanded/singleton doctrines plus integration trial.
- Late v20 trait/behavior research moved post-Boss4; HP12/ATK10/DEF10/SPD4 moved to endgame chapter 10.
- Boss rewards renamed/documented as bridges into the next chapter's system.
- Added progression57.js, progression57_curriculum.test.js and AUDIT_v0.57_PROGRESSION.json.

## v0.58 / Roadmap 10/10 — エンドコンテンツ再構築
- 旧「全141構成がHP×12/攻撃×10/防御×10/速度×4を倒す」固定試験を廃止。現在の49キャラクター＋128スタイル＝177構成を動的取得する。
- 公式エンドコンテンツを8校正（先陣/覚醒/群動/消耗/浄化/適応/空隙/統合）へ分割。各校正はステータス壁ではなく複数の攻略軸を持つ。
- 全177構成に2種類以上の攻略ルートを割り当て、最低1ルートはキャラクター/スタイルのコンセプトと直接一致することを固定テスト。
- HP×12等は任意の「極限数値研究」として残すが、全域校正の合格条件・通常進行条件にはしない。
- 旧 expansion34_core_builds / endgame_all_styles を新基準へ移行。全テスト 68/68 PASS。


## v0.59 最終監査修正 1/4（カード品質）
- 最終監査で検出した表示/実処理不一致のうち、v0.34正常化系列24枚を実値へ同期。
- 連撃/攻防複合の代表的支配系列15枚を再設計。hit数の差だけを採用理由にせず、単発支援・状態異常・防御継続・予約・消失・敵行動・提示中へ役割分岐。
- `balance59_finalfix_cards.js` と `finalfix59_card_quality.test.js` を追加。
- 全回帰テスト PASS。
- 次回は残存説明不一致候補と42支配候補/60類似群の全件再監査を継続する。

## v0.60 最終監査修正 2/4（支配候補・数字違い群）
- v0.58監査の42支配候補を再確認。42件は15枚の連撃/攻防複合系列に集中しており、v0.59の役割分岐を維持したうえで、七重穿ちの消失プロパティを実戦処理 `vanishAfterUse` へ修正。
- 数字だけを伏せた60類似群から、純防御、反撃、低HP、自傷、晩成、状態異常種類、再構築、回収、毒、多段後防御、位置、非選択、連結など11系列・43枚を追加再設計。
- 同じ条件の数値階段ではなく、防御継続/症状準備/循環/安定防御/単発支援/消失/予約など異なる出口へ分岐。
- `finalfix60_card_ecology.test.js` を追加。広域修正数、主要系列の役割出口非重複、七重穿ちの実消失、無条件数値上限を固定。

## v0.61 — 最終監査修正 3/4
- 177構成×8公式校正を実際の戦闘エンジンで走らせる `endgame61_combat_audit.js` を追加。
- 一次実戦監査1,416戦を保存 (`AUDIT_v0.61_REAL_COMBAT.json`)。
- 静的ルート判定では見えなかった校正難度格差・採用偏重・状態異常格差・0勝構成を検出。
- 今回は検出回。結果を隠すための数値バフは行わず、次回の実測調整対象として固定。

## v0.62 - Final audit fix 4
- 177構成×8校正の実戦結果を用いて公式校正を第一次再調整。
- リスク原型、ゼファー霧流型の0勝状態をコンセプト維持の小規模ルール補助で解消。
- v0.61で過集中した5カードを正常化。
- 1,416戦再探索で177/177構成が最低1校正を実勝利。
- 校正の過易化と新たな高採用札を検出したため、正式版判定は継続。

### Working v0.63 — Final audit fix 5: convergence gate
- 散開破片・災厄プロトコルの万能化を解体。
- 8校正を再調整し、単一シードだけで最終合格しない複数シード監査ゲートを追加。
- 実戦探索器をhybrid/trial/concept候補・global shard index・SEED_OFFSET対応へ拡張。

## v0.64 最終監査修正6
- 3シード実戦監査を開始。
- 実戦探索器がエコー《孤響型》へ2枚積みを強制していた監査バイアスを修正し、10種1枚構築を生成するよう変更。
- `endgame64_multiseed_audit.js` / `finalfix64_audit_integrity.test.js` を追加。
- 部分3シード監査で、消耗校正と凍傷軸に追加確認が必要と判定。最終監査PASSは保留。

## v0.65 最終監査修正7
- 実戦探索器をスタイル固有構築制約対応へ拡張。
- hybrid / concept / trial の3構築候補を3シードで比較する最終監査仕様へ更新。
- 9スタイルの監査プロファイルと専用整合テストを追加。

## v0.66 最終監査修正8
- 177構成の複数シード実戦監査を構成単位でチェックポイント保存する再開可能方式へ変更。
- `endgame66_resumable_audit.js` / `endgame66_merge_audit.js` を追加。
- 177構成完走前の最終監査PASSと、部分結果による先走ったバランス変更を禁止。

## v0.67 最終監査修正9 — 全177構成監査の実行継続
- v0.66 の構成単位チェックポイント方式を実運用し、複数シード全件監査の結果を蓄積。
- 長時間監査を現実的に完走させる `endgame67_parallel_resume.js` を追加。構成ごとのJSONを唯一の進捗源とし、完了済み構成は再計算しない。
- 途中結果だけでカード/校正を再調整しない方針を維持。177/177が揃うまで最終監査PASSは禁止。
- このチェックポイントでは51/177構成の3方針×3シード監査結果を保存済み。ゲーム性能は部分結果を理由に変更していない。

## v0.68 最終監査修正10 — 全177構成監査の継続
- 再開可能・並列実戦監査を51/177から81/177へ進行。
- 完了済み30構成を追加保存し、再計算不要のチェックポイントとして固定。
- 部分結果による早期バランス調整は行わず、177/177完走ゲートを維持。
- 全回帰テスト: All checks passed。

## v0.69 - Final audit fix 11
- Continued resumable real-combat audit from 81/177 to 128/177 variants.
- Preserved per-variant JSON checkpoints under AUDIT_v0.66_PARTS.
- No gameplay balance changes were made from partial audit data.

## v0.70 最終監査修正12
- 177/177構成・8校正・3シード監査を完走し、AUDIT_v0.66_MULTISEED_COMPLETE.json を正式統合。
- 174/177構成に実勝利経路、未勝利3構成を確定。
- 消耗校正11/177、凍傷採用勝利0件を確定問題として記録。
- 輪転継電型・コンバータ消費型の監査構築プロファイルを補強。ゲーム性能の先行バフは行わない。

## v0.71 - 最終監査修正13
- v0.70完全監査で確定した凍傷0採用を受け、凍傷を「次の敵ターンの各攻撃を一時抑制する」短期防御へ再設計。減衰を2→1、抑制係数を25%→40%へ変更。
- 凍傷カード5枚を攻撃/防御/循環から入れる横方向の入口として再調整。巨大素数値による救済は不採用。
- 消耗校正の装甲・耐性を軽く緩和し、再生を維持したまま長期資源戦として再校正。
- 実戦探索器が連結系スタイルでcardLinkを設定していなかった監査不具合を修正。
- v0.70未勝利3構成を対象再監査し、3構成すべてに実勝利経路を確認。直接バフは見送り。
- 全回帰テスト PASS。

## v0.72 - 最終監査修正14 — v0.71完全再監査の開始
- v0.71の凍傷再設計・消耗校正再調整・連結監査修正を反映した状態で、旧v0.70監査結果を流用せず177構成の完全再監査を新規開始。
- 監査条件は8校正 × hybrid/concept/trial × 3シードを維持。
- 旧177件の構成別結果は `AUDIT_v0.70_PARTS_BACKUP` へ退避し、v0.71以降の結果と混在しないよう分離。
- このチェックポイントでは新基準16/177構成まで再監査済み。部分結果からゲーム性能は変更しない。
- 177/177完走前の最終監査PASSは禁止を維持。

## v0.73 - 最終監査修正15 — v0.71完全再監査の継続
- 新基準の構成単位実戦監査を16/177から48/177へ進行（+32構成）。
- 8校正 × hybrid/concept/trial × 3シードの条件を維持。
- 部分結果からカード・状態異常・校正の性能変更は行っていない。
- 177/177完走前の最終監査PASS禁止を維持。

## v0.74 - 最終監査修正16 — v0.71完全再監査177/177完走
- 48/177から再開し、177/177構成の実戦監査を完走。1,416校正結果を正式統合。
- 177/177構成すべてに最低1つの実勝利経路を確認。未勝利構成0。
- 状態異常勝利採用は毒294 / 火傷211 / 出血164 / 凍傷1。凍傷は完全0を脱した。
- 完成阻害級4条件で再判定し、残ったBLOCKは消耗校正11/177（6.2%）のみ。
- 全件再監査は本更新で終了。次回以降は消耗校正だけを局所修正・局所再検証し、177構成全体を再リセットしない。


## v0.75 最終監査修正17 — 消耗校正局所収束 / 最終監査PASS
- v0.74唯一のBLOCKだった消耗校正11/177を局所再検証。
- 長期資源戦を全校正共通20ターンで打ち切る監査バイアスを修正し、消耗校正のみ60ターン観測。敵性能はv0.71値を維持し追加弱体化なし。
- 177構成×消耗校正×3seedの局所監査で25/177（14.1%）に勝利経路、22/177は2/3seed以上で勝利。
- 完成阻害級4条件をすべてPASS。最終全件監査をPASSとして固定し、以後177構成全件監査ループへ戻らない。
