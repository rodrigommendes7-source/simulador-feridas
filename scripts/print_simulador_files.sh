#!/usr/bin/env bash
set -euo pipefail
# Usage: ./scripts/print_simulador_files.sh > /tmp/simulador_full_dump.txt

FILES=(
  "app/aprender/page.tsx"
  "app/casos/1/page.tsx"
  "app/casos/2/page.tsx"
  "app/historico/page.tsx"
  "app/lib/simulador.ts"
  "app/types/caso-config.ts"
  "app/types/simulador.ts"
  "data/casos/caso1.json"
  "data/casos/caso2.json"
)

echo "Dumping ${#FILES[@]} ficheiros..."
echo

for f in "${FILES[@]}"; do
  echo "===== BEGIN: ${f} ====="
  cat "$f"
  echo
  echo "===== END: ${f} ====="
  echo
done
