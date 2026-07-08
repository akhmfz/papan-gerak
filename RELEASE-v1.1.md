# Semantic Platform v1.1 — Inject2 Pipeline

**Release Date:** 2026-07-08

## Overview

Semantic Platform v1.1 introduces the Inject2 Pipeline — a two-stage system that
extracts semantic structure from Pine Script code and injects it into the Graphify
knowledge graph. This bridges the gap created by tree-sitter's lack of Pine Script
support.

## Highlights

- **extract_ast.py**: ANTLR-based parser using pynescript — extracts functions,
  calls, variables, reads/writes from `.pine` files
- **inject_graph.py**: Injects `calls`, `reads`, `writes`, `belongs_to` edges into
  Graphify `graph.json`
- **pine_query.py**: Semantic query engine — `function`, `callers`, `callees`,
  `module`, `search`, `explain`, `stats`
- **pine_context.py**: Context assembly for AI agents — profiles for review,
  implementation, architecture, bugfix
- **pine_validate.py**: 5-category validation — parser, schema, graph, golden, context

## Architecture

```
Pine Script → extract_ast.py → pine_semantic.json → inject_graph.py → graph.json
                                                                        │
                                   Query Engine ← Context Engine ← Validation
                                                                        │
                                                                   OpenCode/AI
```

See `docs/architecture-overview.md` for full diagram.

## Baseline Statistics

| Metric | Before | After |
|--------|--------|-------|
| Nodes | 303 | 303 |
| Edges | 192 | 543 |
| Calls edges | 0 | 27 |
| Reads edges | 0 | 311 |
| Writes edges | 0 | 205 |
| Isolated nodes | ~70% | 4.6% |
| Schema | — | 1.1 |
| Functions extracted | — | 20 |
| Modules | 5 | 5 |
| Validation (4 checks) | — | ✅ PASS |

## Known Limitations

- **Parser speed**: ANTLR-based parse takes >120s per project — optimization needed
- **Toolchain location**: Scripts live in `papan-instrumen/scripts/` — not yet a
  standalone package (planned for v2.0)

## Migration Notes

- Fully backward compatible — existing Graphify graph continues to work
- `pine_semantic.json` committed as semantic snapshot (do not `.gitignore`)
- Legacy manual inject scripts moved to `scripts/deprecated/`

## Roadmap

- **v1.2**: Resolve rate ≥80%, parser optimization
- **v2.0**: Toolchain split to standalone repo (`pine-semantic-platform`)
- **Backlog**: P1-1 (sector-aware volatility), P1-2 (MTF alignment), P2-1 (volume profile)
