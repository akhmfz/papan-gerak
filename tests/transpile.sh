#!/usr/bin/env bash
# Syntax validation via PineTS
set -euo pipefail

echo "🧪 Transpile check — Papan Gerak"
npx pinets check src/PapanGerak.pine 2>&1
echo "✅ Transpile check complete"
