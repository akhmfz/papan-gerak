#!/usr/bin/env bash
# Build script: Concatenate modules → PapanGerak.pine
set -euo pipefail
cd "$(dirname "$0")"

OUTPUT="src/PapanGerak.pine"
MODULES_DIR="src/modules"

echo "🔨 Building Papan Gerak..."
echo ""

# Remove existing built file
rm -f "$OUTPUT"

# Concatenate modules in order
for module in "$MODULES_DIR"/01-base.pine "$MODULES_DIR"/02-data.pine "$MODULES_DIR"/03-scoring.pine "$MODULES_DIR"/04-ui.pine; do
    basename "$module"
    cat "$module" >> "$OUTPUT"
    echo "" >> "$OUTPUT"
done

echo ""
echo "✅ Build complete: $OUTPUT"
echo "   Lines: $(wc -l < "$OUTPUT")"
