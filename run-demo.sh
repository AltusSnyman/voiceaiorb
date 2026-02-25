#!/usr/bin/env bash
set -euo pipefail

PORT="${1:-8000}"
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if command -v python3 >/dev/null 2>&1; then
  PY_CMD="python3"
elif command -v python >/dev/null 2>&1; then
  PY_CMD="python"
else
  echo "Error: Python is required to run the demo server." >&2
  exit 1
fi

echo "Starting static demo server from: ${ROOT_DIR}"
echo "Open:"
echo "  http://localhost:${PORT}/index.html"
echo "  http://localhost:${PORT}/test.html"
echo "  http://localhost:${PORT}/in-page-orb.html"
echo

cd "${ROOT_DIR}"
exec "${PY_CMD}" -m http.server "${PORT}"
