# Graph Report - /home/Akhmfz/papan-gerak  (2026-07-08)

## Corpus Check
- Corpus is ~16,414 words - fits in a single context window. You may not need a graph.

## Summary
- 104 nodes · 80 edges · 28 communities (13 shown, 15 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.65)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Community 0
- Community 2
- Community 3
- Community 4
- Community 7
- Community 8
- Community 9
- Community 11
- Community 12
- Community 13
- Community 14
- Community 15
- Community 20
- Community 21
- Community 22
- Community 23
- Community 24
- Community 25
- Community 26
- Community 27

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

## Communities (28 total, 15 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.12
Nodes (17): Full Build Changelog, AI Roles (Papan Gerak), 10-Langkah Trading Flow, Compact Mode — 1 Line, Detailed Mode — Sub-Indikator, Forward Return Tracker, Narrative Engine (Insight baris-1), Signal System (BUY/HOLD/SELL) (+9 more)

### Community 2 - "Community 2"
Cohesion: 0.25
Nodes (7): description, devDependencies, pinets, license, name, private, version

### Community 3 - "Community 3"
Cohesion: 0.29
Nodes (7): Momentum Score (30%), Smart Money Flow (Optional), Trend Score (30%), Volatility Score (20%), Volume Score (20%), 4 Dimensi Scoring (Teknikal), Papan Instrumen Companion

### Community 4 - "Community 4"
Cohesion: 0.29
Nodes (7): scripts, build, ci, lint, test, test:all, transpile

### Community 8 - "Community 8"
Cohesion: 0.67
Nodes (3): Pine Connector Integration, TradersPost Webhook Integration, Webhook Integration Support

## Knowledge Gaps
- **39 isolated node(s):** `build.sh script`, `name`, `version`, `description`, `private` (+34 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Papan Gerak — Technical Analysis Dashboard` connect `Community 0` to `Community 8`, `Community 3`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **Why does `4 Dimensi Scoring (Teknikal)` connect `Community 3` to `Community 0`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Why does `scripts` connect `Community 4` to `Community 2`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **What connects `build.sh script`, `name`, `version` to the rest of the system?**
  _53 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._