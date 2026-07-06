#!/usr/bin/env bash
# Lite linter — cek reserved keywords dan budget
set -euo pipefail

SRC="src/modules"
ERRORS=0

echo "🔍 Linting Papan Gerak..."
echo ""

# Check reserved keywords
for kw in "open" "high" "low" "close" "volume" "base"; do
    if grep -ni "\b${kw}\b" "$SRC"/*.pine | grep -v "//.*\b${kw}\b" | grep -v '"' > /dev/null 2>&1; then
        echo "⚠️  Potensi reserved keyword '$kw' ditemukan:"
        grep -ni "\b${kw}\b" "$SRC"/*.pine | grep -v "//.*\b${kw}\b" | grep -v '"' || true
        ERRORS=$((ERRORS + 1))
    fi
done

# Line budget per module
declare -A BUDGET=(
    ["01-base.pine"]=200
    ["02-data.pine"]=200
    ["03-scoring.pine"]=250
    ["04-ui.pine"]=200
)

for file in "${!BUDGET[@]}"; do
    if [ -f "$SRC/$file" ]; then
        lines=$(wc -l < "$SRC/$file")
        max=${BUDGET[$file]}
        if [ "$lines" -gt "$max" ]; then
            echo "⚠️  $file: $lines lines (budget: $max)"
            ERRORS=$((ERRORS + 1))
        fi
    fi
done

if [ "$ERRORS" -eq 0 ]; then
    echo "✅ Lint passed"
else
    echo "❌ $ERRORS lint issue(s) found"
fi
exit "$ERRORS"
