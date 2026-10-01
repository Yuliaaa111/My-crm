#!/bin/bash
# PreToolUse hook: blocks Read/Edit/Write on real .env files.
# .env.example stays allowed — it's the public template, not secrets.
# Pattern follows the official "Block edits to protected files" example.

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Normalize Windows backslash separators so the pattern below matches
FILE_PATH="${FILE_PATH//\\//}"
BASE=$(basename "$FILE_PATH")

if [[ "$BASE" =~ ^\.env(\..+)?$ ]] && [[ "$BASE" != ".env.example" ]]; then
  echo "Blocked: '$BASE' is a real environment file and may contain secrets. Reading or editing it requires explicit permission from the user for this specific request." >&2
  exit 2
fi

exit 0
