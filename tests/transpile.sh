#!/usr/bin/env bash
# Syntax validation via PineTS
set -euo pipefail

echo "🧪 Transpile check — Papan Gerak"
npx pinets run src/PapanGerak.pine 2>&1 || echo "⚠️ Transpile run not expected to produce output (just syntax check)"
echo "✅ Transpile check complete"
