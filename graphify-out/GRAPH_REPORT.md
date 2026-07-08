# Graph Report - .  (2026-07-08)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 297 nodes · 192 edges · 108 communities (19 shown, 89 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.65)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f7639a0c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- 02-data.pine
- 01-base.pine
- Papan Gerak — Technical Analysis Dashboard
- package.json
- full-pinets.mjs
- lint.sh
- build.sh
- Confluence Counter
- Entry Trigger Engine
- JSON Webhook Format
- gh-sync.sh
- f_momentumScore
- f_smartMoneyScore
- f_trendScore
- f_volatilityScore
- f_volumeScore
- transpile.sh
- AI Golden Rules (Papan Gerak)
- Built-in Backtest (20 signals)
- Overall Score (0-100)
- Changelog Papan Gerak
- Module Line Budget
- Pine Script v6 Strategy Patterns
- TradingView Publication Description
- f_colorScore(float score)
- f_scoreHigher(float val, float min, float max)
- f_scoreLower(float val, float min, float max)
- f_scoreRange(val, min, max, idealLow, idealHigh)
- f_secure(input, def)
- f_signalText(float score, string lang)
- f_choppiness(int length)
- risk: atrSl
- signal: breakoutTrigger
- bt: btDirs
- bt: btEntryBars
- bt: btEntryPrices
- bt: btHead
- bt: btTotalEval
- bt: btTotalReturn
- bt: btWinRate
- bt: btWins
- signal: chopFilterOk
- signal: currentZone
- signal: entryTriggered
- signal: fwdBars
- signal: fwdReturn
- signal: minBarsOk
- confluence: momBull
- confluence: momTotal
- score: normMomentum
- score: normTrend
- score: normVolatility
- score: normVolume
- score: overallScore
- signal: prevZone
- signal: pullbackTrigger
- risk: riskAmount
- risk: riskAtrCapture
- risk: riskEntryPrice
- risk: riskLevelLabel
- risk: riskRp
- risk: riskSwingHigh
- risk: riskSwingLow
- signal: signalColor
- signal: signalDirection
- signal: signalEntryBar
- signal: signalEntryPrice
- signal: signalStatus
- signal: signalText
- signal: signalTriggered
- risk: slPct
- risk: slPrice
- risk: suggestedLots
- risk: swingSl
- risk: targetPct
- risk: targetPrice
- score: totalWeight
- confluence: trendBull
- confluence: trendTotal
- confluence: volBull
- confluence: volTotal
- confluence: volmBull
- confluence: volmTotal
- signal: zoneChanged
- alert: choppinessAlert
- alert: entryAlert
- f_confStr(n, total)
- f_webhookMsg(eventType, params)
- alert: rsiOverboughtAlert
- alert: rsiOversoldAlert
- alert: smartMoneyAlert
- alert: trendExtremeAlert
- alert: volumeSpikeAlert

## God Nodes (most connected - your core abstractions)
1. `Papan Gerak — Technical Analysis Dashboard` - 18 edges
2. `scripts` - 7 edges
3. `4 Dimensi Scoring (Teknikal)` - 6 edges
4. `Webhook Integration Support` - 3 edges
5. `90 Automated Tests` - 2 edges
6. `Papan Instrumen Companion` - 2 edges
7. `Volume Score (20%)` - 2 edges
8. `build.sh script` - 1 edges
9. `private` - 1 edges
10. `build` - 1 edges

## Surprising Connections (you probably didn't know these)
- `Full Build Changelog` --conceptually_related_to--> `Papan Gerak — Technical Analysis Dashboard`  [EXTRACTED]
  CHANGELOG.md → README.md
- `AI Roles (Papan Gerak)` --conceptually_related_to--> `Papan Gerak — Technical Analysis Dashboard`  [EXTRACTED]
  docs/AI.md → README.md
- `10-Langkah Trading Flow` --conceptually_related_to--> `Papan Gerak — Technical Analysis Dashboard`  [EXTRACTED]
  docs/PANDUAN-TRADING.md → README.md
- `Compact Mode — 1 Line` --conceptually_related_to--> `Papan Gerak — Technical Analysis Dashboard`  [EXTRACTED]
  docs/README.id.md → README.md
- `Detailed Mode — Sub-Indikator` --conceptually_related_to--> `Papan Gerak — Technical Analysis Dashboard`  [EXTRACTED]
  docs/README.id.md → README.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **4 Dimensi Scoring Teknikal** — docs_architecture_trendscore, docs_architecture_momentumscore, docs_architecture_volatilityscore, docs_architecture_volumescore [EXTRACTED 1.00]
- **3 Display Modes** — docs_readme_id_compactmode, docs_readme_id_standardmode, docs_readme_id_detailedmode [EXTRACTED 1.00]

## Communities (108 total, 89 thin omitted)

### Community 0 - "02-data.pine"
Cohesion: 0.04
Nodes (53): ta: adxDn, ta: adxStrong, ta: adxTrend, ta: adxUp, ta: adxValue, ta: atrPercent, ta: atrValue, ta: bbLower (+45 more)

### Community 1 - "01-base.pine"
Cohesion: 0.04
Nodes (51): input: accountBalanceInput, input: adxLength, input: adxThreshold, input: atrLength, input: bahasaInput, input: bbLength, input: bbMult, input: chopLength (+43 more)

### Community 2 - "Papan Gerak — Technical Analysis Dashboard"
Cohesion: 0.08
Nodes (27): Full Build Changelog, AI Roles (Papan Gerak), Momentum Score (30%), Smart Money Flow (Optional), Trend Score (30%), Volatility Score (20%), Volume Score (20%), 10-Langkah Trading Flow (+19 more)

### Community 3 - "package.json"
Cohesion: 0.13
Nodes (14): description, devDependencies, pinets, license, name, private, scripts, build (+6 more)

## Knowledge Gaps
- **217 isolated node(s):** `build.sh script`, `name`, `version`, `description`, `private` (+212 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **89 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What connects `build.sh script`, `name`, `version` to the rest of the system?**
  _231 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `02-data.pine` be split into smaller, more focused modules?**
  _Cohesion score 0.037037037037037035 - nodes in this community are weakly interconnected._
- **Should `01-base.pine` be split into smaller, more focused modules?**
  _Cohesion score 0.038461538461538464 - nodes in this community are weakly interconnected._
- **Should `Papan Gerak — Technical Analysis Dashboard` be split into smaller, more focused modules?**
  _Cohesion score 0.07692307692307693 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._