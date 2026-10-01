#!/bin/bash
# Stop hook: runs the project's typecheck and blocks completion
# (exit 2) if it fails, forcing Claude to fix errors before stopping.

INPUT=$(cat)

# Official loop-guard: stop_hook_active is true when this Stop event
# is already a re-evaluation triggered by a previous block from this
# same hook. Checking it prevents a hook from blocking itself in a
# tight loop with no new work happening in between.
if [ "$(echo "$INPUT" | jq -r '.stop_hook_active')" = "true" ]; then
  exit 0
fi

cd "${CLAUDE_PROJECT_DIR}" || exit 0

if command -v npm >/dev/null 2>&1 && grep -q '"typecheck"' package.json 2>/dev/null; then
  OUTPUT=$(npm run typecheck --silent 2>&1)
  STATUS=$?
else
  OUTPUT=$(npx --no-install tsc --noEmit 2>&1)
  STATUS=$?
fi

if [ $STATUS -eq 0 ]; then
  exit 0
fi

echo "Typecheck failed. Fix the following errors before finishing:" >&2
echo "$OUTPUT" >&2
exit 2
