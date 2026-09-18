#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
find "$ROOT/js" -name '*.js' -print0 | xargs -0 -n1 node --check
count=0
while IFS= read -r test; do
  node "$test"
  count=$((count+1))
done < <(find "$ROOT/tests" -maxdepth 1 -name '*.test.js' | sort)
echo "All checks passed. ($count tests)"
