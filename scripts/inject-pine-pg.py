#!/usr/bin/env python3
"""Inject Pine Script symbols into Papan Gerak graph.json"""

import json
from pathlib import Path

PROJECT = "/home/Akhmfz/papan-gerak"
GRAPH_FILE = f"{PROJECT}/graphify-out/graph.json"
BASE = f"{PROJECT}/src/modules"

modules = {
    "01-base": f"{BASE}/01-base.pine",
    "02-data": f"{BASE}/02-data.pine",
    "03-scoring": f"{BASE}/03-scoring.pine",
    "04-ui": f"{BASE}/04-ui.pine",
}

# ============================================================
# NODES
# ============================================================
pine_nodes = []

# --- Module nodes ---
for mod, path in modules.items():
    pine_nodes.append({
        "id": f"src_modules_{mod.replace('-','')}",
        "label": f"{mod}.pine",
        "file_type": "code",
        "source_file": path,
    })

# --- Utility functions (01-base) ---
utils = [
    ("f_secure", "f_secure(input, def)"),
    ("f_scoreHigher", "f_scoreHigher(float val, float min, float max)"),
    ("f_scoreLower", "f_scoreLower(float val, float min, float max)"),
    ("f_scoreRange", "f_scoreRange(val, min, max, idealLow, idealHigh)"),
    ("f_colorScore", "f_colorScore(float score)"),
    ("f_signalText", "f_signalText(float score, string lang)"),
]
for name, label in utils:
    pine_nodes.append({
        "id": f"src_modules_01base_{name}",
        "label": label,
        "file_type": "code",
        "source_file": modules["01-base"],
    })

# --- Data functions (02-data) ---
data_funcs = [
    ("f_choppiness", "f_choppiness(int length)"),
    ("f_netVolume", "f_netVolume()"),
    ("f_smartMoneyDetect", "f_smartMoneyDetect()"),
    ("f_isBodyVolume", "f_isBodyVolume()"),
]
for name, label in data_funcs:
    pine_nodes.append({
        "id": f"src_modules_02data_{name}",
        "label": label,
        "file_type": "code",
        "source_file": modules["02-data"],
    })

# --- Scoring functions (03-scoring) ---
scoring_funcs = [
    ("f_trendScore", "f_trendScore()"),
    ("f_momentumScore", "f_momentumScore()"),
    ("f_volatilityScore", "f_volatilityScore()"),
    ("f_volumeScore", "f_volumeScore()"),
    ("f_smartMoneyScore", "f_smartMoneyScore()"),
    ("f_narrative", "f_narrative()"),
]
for name, label in scoring_funcs:
    pine_nodes.append({
        "id": f"src_modules_03scoring_{name}",
        "label": label,
        "file_type": "code",
        "source_file": modules["03-scoring"],
    })

# --- UI functions (04-ui) ---
ui_funcs = [
    ("f_getPosition", "f_getPosition()"),
    ("f_getFontSize", "f_getFontSize()"),
    ("f_confStr", "f_confStr(n, total)"),
    ("f_webhookMsg", "f_webhookMsg(eventType, params)"),
]
for name, label in ui_funcs:
    pine_nodes.append({
        "id": f"src_modules_04ui_{name}",
        "label": label,
        "file_type": "code",
        "source_file": modules["04-ui"],
    })

# --- Input variables ---
inputs = [
    # Display & General
    "tablePositionInput", "fontSizeInput", "modeInput", "bahasaInput",
    "colorThemeInput",
    # Trend
    "emaFastPeriod", "emaMidPeriod", "emaSlowPeriod",
    "superTrendFactor", "superTrendPeriod",
    "adxLength", "adxThreshold",
    # Momentum
    "rsiLength", "rsiOb", "rsiOs",
    "macdFast", "macdSlow", "macdSignal",
    "stochK", "stochD", "stochOb", "stochOs",
    # Volatility
    "atrLength", "bbLength", "bbMult", "chopLength",
    # Volume
    "volMaLength", "volSpikeMult",
    # Weights
    "weightTrend", "weightMomentum", "weightVolatility", "weightVolume",
    # Smart Money
    "enableSmartMoney", "weightSmartMoney", "smVolumeThreshold", "smPeriod",
    # Signal
    "minSignalBars", "signalFilterMode", "confirmOnBarClose",
    # Risk
    "showRiskLevels", "slTypeInput", "slAtrMult", "slSwingPeriod", "targetR",
    # Position Size
    "showPositionSizing", "accountBalanceInput", "riskPctInput",
    # MTF
    "enableMtfFilter", "mtfTimeframe",
    # Entry Trigger
    "entryTriggerMode",
    # Webhook
    "webhookFormat",
]
for inp in inputs:
    pine_nodes.append({
        "id": f"src_modules_01base_{inp}",
        "label": f"input: {inp}",
        "file_type": "code",
        "source_file": modules["01-base"],
    })

# --- TA indicator variables (02-data) ---
ta_vars = [
    "emaFast", "emaMid", "emaSlow", "emaPosition", "emaTrend",
    "superTrend", "superTrendDir", "stBullish",
    "adxUp", "adxDn", "adxValue", "adxStrong", "adxTrend", "trendAligned",
    "rsiValue", "rsiObHit", "rsiOsHit", "rsiDirection",
    "macdLine", "macdSignalLine", "macdHist",
    "macdBullish", "macdHistRising", "macdZero",
    "stochKVal", "stochDVal", "stochBullish", "stochObHit", "stochOsHit",
    "atrValue", "atrPercent",
    "bbMiddle", "bbStdDev", "bbUpper", "bbLower",
    "bbWidth", "bbWidthAvg", "bbPosition",
    "chopValue", "chopTrending", "chopRanging",
    "volMA", "volRatio", "volSpike",
    "obvValue", "obvMA", "obvTrend", "obvAgree",
    "netVol", "netVolSmooth",
    "smDetected", "smBodyVol",
    "mtfTrendScore",
]
for tv in ta_vars:
    pine_nodes.append({
        "id": f"src_modules_02data_{tv}",
        "label": f"ta: {tv}",
        "file_type": "code",
        "source_file": modules["02-data"],
    })

# --- Scoring outputs (03-scoring) ---
score_vars = [
    "trendScore", "momentumScore", "volatilityScore", "volumeScore",
    "smartMoneyScore", "totalWeight",
    "normTrend", "normMomentum", "normVolatility", "normVolume",
    "overallScore",
]
for sv in score_vars:
    pine_nodes.append({
        "id": f"src_modules_03scoring_{sv}",
        "label": f"score: {sv}",
        "file_type": "code",
        "source_file": modules["03-scoring"],
    })

# --- Confluence counters ---
conf_vars = [
    "trendBull", "trendTotal",
    "momBull", "momTotal",
    "volBull", "volTotal",
    "volmBull", "volmTotal",
]
for cv in conf_vars:
    pine_nodes.append({
        "id": f"src_modules_03scoring_{cv}",
        "label": f"confluence: {cv}",
        "file_type": "code",
        "source_file": modules["03-scoring"],
    })

# --- Signal engine ---
sig_vars = [
    "signalText", "signalColor",
    "currentZone", "prevZone", "zoneChanged",
    "minBarsOk", "chopFilterOk",
    "signalTriggered", "pullbackTrigger", "breakoutTrigger",
    "entryTriggered", "signalDirection",
    "signalEntryPrice", "signalEntryBar",
    "fwdReturn", "signalStatus", "fwdBars",
]
for sv in sig_vars:
    pine_nodes.append({
        "id": f"src_modules_03scoring_{sv}",
        "label": f"signal: {sv}",
        "file_type": "code",
        "source_file": modules["03-scoring"],
    })

# --- Risk management ---
risk_vars = [
    "riskEntryPrice", "riskAtrCapture",
    "riskSwingLow", "riskSwingHigh",
    "atrSl", "swingSl", "slPrice",
    "riskAmount", "targetPrice",
    "slPct", "targetPct", "riskLevelLabel",
    "riskRp", "suggestedLots",
]
for rv in risk_vars:
    pine_nodes.append({
        "id": f"src_modules_03scoring_{rv}",
        "label": f"risk: {rv}",
        "file_type": "code",
        "source_file": modules["03-scoring"],
    })

# --- Backtest tracker ---
bt_vars = [
    "btEntryBars", "btEntryPrices", "btDirs",
    "btHead", "btTotalEval", "btWins", "btWinRate", "btTotalReturn",
]
for bv in bt_vars:
    pine_nodes.append({
        "id": f"src_modules_03scoring_{bv}",
        "label": f"bt: {bv}",
        "file_type": "code",
        "source_file": modules["03-scoring"],
    })

# --- Alert events ---
alert_events = [
    "entryAlert", "trendExtremeAlert", "rsiOversoldAlert",
    "rsiOverboughtAlert", "volumeSpikeAlert", "smartMoneyAlert",
    "choppinessAlert",
]
for ae in alert_events:
    pine_nodes.append({
        "id": f"src_modules_04ui_{ae}",
        "label": f"alert: {ae}",
        "file_type": "code",
        "source_file": modules["04-ui"],
    })

# ============================================================
# EDGES
# ============================================================
pine_edges = []

# Module dependency chain
mod_order = ["01base", "02data", "03scoring", "04ui"]
for i in range(len(mod_order) - 1):
    src = f"src_modules_{mod_order[i]}"
    tgt = f"src_modules_{mod_order[i+1]}"
    pine_edges.append({
        "source": src, "target": tgt,
        "relation": "depends_on",
        "confidence": "EXTRACTED", "confidence_score": 1.0,
        "source_file": modules[list(modules.keys())[i+1]],
    })

# Input → module
for inp in inputs:
    pine_edges.append({
        "source": f"src_modules_01base_{inp}",
        "target": "src_modules_01base",
        "relation": "belongs_to",
        "confidence": "EXTRACTED", "confidence_score": 1.0,
        "source_file": modules["01-base"],
    })

# TA vars → 02-data module
for tv in ta_vars:
    pine_edges.append({
        "source": f"src_modules_02data_{tv}",
        "target": "src_modules_02data",
        "relation": "belongs_to",
        "confidence": "EXTRACTED", "confidence_score": 1.0,
        "source_file": modules["02-data"],
    })

# Scoring → trend/momentum/vol/volume functions
scoring_map = {
    "trendScore": "f_trendScore",
    "momentumScore": "f_momentumScore",
    "volatilityScore": "f_volatilityScore",
    "volumeScore": "f_volumeScore",
    "smartMoneyScore": "f_smartMoneyScore",
}
for var, func in scoring_map.items():
    pine_edges.append({
        "source": f"src_modules_03scoring_{var}",
        "target": f"src_modules_03scoring_{func}",
        "relation": "calls",
        "confidence": "EXTRACTED", "confidence_score": 1.0,
        "source_file": modules["03-scoring"],
    })

# ============================================================
# MERGE
# ============================================================
graph = json.loads(Path(GRAPH_FILE).read_text())

# graph.json uses NetworkX format: 'links' not 'edges'
existing_ids = {n["id"] for n in graph["nodes"]}
added_nodes = 0
for n in pine_nodes:
    if n["id"] not in existing_ids:
        graph["nodes"].append(n)
        existing_ids.add(n["id"])
        added_nodes += 1

existing_links = set()
for e in graph.get("links", []):
    existing_links.add((e["source"], e["target"], e.get("relation", "")))
added_edges = 0
for e in pine_edges:
    key = (e["source"], e["target"], e.get("relation", ""))
    if key not in existing_links:
        graph["links"].append(e)
        existing_links.add(key)
        added_edges += 1

Path(GRAPH_FILE).write_text(json.dumps(graph, indent=2))
print(f"PG inject: +{added_nodes} nodes, +{added_edges} edges")
print(f"Total: {len(graph['nodes'])} nodes, {len(graph['links'])} links")
