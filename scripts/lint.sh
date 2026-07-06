#!/usr/bin/env bash
# Lite linter — cek reserved keywords dan budget
set -euo pipefail

SRC="src/modules"
ERRORS=0

echo "🔍 Linting Papan Gerak..."
echo ""

# Check reserved keywords in function parameters
for kw in "open" "high" "low" "close" "volume" "base"; do
    results=$(grep -nP '\b'"${kw}"'\b' "$SRC"/*.pine | grep -P '=>' | grep -v "//.*\b${kw}\b" | grep -v '".*'"${kw}"'.*"' || true)
    if [ -n "$results" ]; then
        echo "⚠️  Reserved keyword '$kw' used as parameter in function definition:"
        echo "$results"
        ERRORS=$((ERRORS + 1))
    fi
done

# Line budget per module
declare -A BUDGET=(
    ["01-base.pine"]=280
    ["02-data.pine"]=210
    ["03-scoring.pine"]=630
    ["04-ui.pine"]=240
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
