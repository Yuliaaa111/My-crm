#!/bin/bash
# PreToolUse hook: blocks git commit/push while the actual current
# branch is main or master, regardless of how the command is phrased.

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

# Only care about commands that touch git commit or git push
# (also catches them inside && chains, ;, or |).
if ! echo "$COMMAND" | grep -Eq '(^|[;&|]|&&|\|\|)\s*git\s+(commit|push)\b'; then
  exit 0
fi

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)

if [[ "$CURRENT_BRANCH" == "main" || "$CURRENT_BRANCH" == "master" ]]; then
  echo "Blocked: current branch is '$CURRENT_BRANCH'. Committing or pushing directly to main/master is not allowed — switch to a feature branch first." >&2
  exit 2
fi

exit 0
