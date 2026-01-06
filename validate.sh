#!/bin/bash
set -Eeuo pipefail

echo "=============================================="
echo "🚀 App-Screen Devcontainer Validation Started"
echo "=============================================="

fail() {
  echo "❌ VALIDATION FAILED: $1"
  exit 1
}

pass() {
  echo "✅ $1"
}

echo ""
echo "🔍 1. Environment checks"

# Check devcontainer
if [[ "${DEVCONTAINER:-false}" != "true" ]]; then
  fail "Not running inside devcontainer (DEVCONTAINER=true not set)"
else
  pass "Running inside devcontainer"
fi

# Workspace folder
if [[ "$(pwd)" != "/workspaces/App-Screen"* ]]; then
  fail "Wrong workspace folder: $(pwd)"
else
  pass "Workspace folder correct"
fi

echo ""
echo "🔍 2. Toolchain checks"

command -v python >/dev/null || fail "Python not found"
command -v node >/dev/null || fail "Node not found"
command -v npm >/dev/null || fail "npm not found"

pass "Python: $(python --version)"
pass "Node: $(node --version)"
pass "npm: $(npm --version)"

# Python venv
PYTHON_PATH=$(which python)
if [[ "$PYTHON_PATH" != *"/venv/"* ]]; then
  fail "Python is not using virtual environment: $PYTHON_PATH"
else
  pass "Python virtual environment active"
fi

echo ""
echo "🔍 3. Dependency checks"

# Python deps
if [[ -f "requirements.txt" ]]; then
  python - <<EOF || fail "Python dependencies not satisfied"
import pkg_resources
pkg_resources.require(open("requirements.txt").read().splitlines())
EOF
  pass "Python dependencies installed"
fi

# Node deps
if [[ -f "package.json" ]]; then
  [[ -d "node_modules" ]] || fail "node_modules missing"
  pass "Node dependencies installed"
fi

echo ""
echo "🔍 4. Environment variables"

[[ -f ".env" ]] || fail ".env file missing"
pass ".env file exists"

[[ -n "${DATABASE_URL:-}" ]] || fail "DATABASE_URL not set"
[[ -n "${REDIS_URL:-}" ]] || fail "REDIS_URL not set"

pass "Required environment variables present"

echo ""
echo "🔍 5. Service connectivity"

# PostgreSQL
if command -v psql >/dev/null; then
  psql "$DATABASE_URL" -c "SELECT 1;" >/dev/null || fail "PostgreSQL not reachable"
  pass "PostgreSQL reachable"
else
  fail "psql client not installed"
fi

# Redis
if command -v redis-cli >/dev/null; then
  redis-cli -h redis ping | grep -q PONG || fail "Redis not reachable"
  pass "Redis reachable"
else
  fail "redis-cli not installed"
fi

echo ""
echo "🔍 6. Backend sanity check"

if [[ -d "backend" ]]; then
  python - <<EOF || fail "Backend import failed"
from src.main import app
print("Backend import OK")
EOF
  pass "Backend imports correctly"
else
  pass "No backend directory found (skipped)"
fi

echo ""
echo "🔍 7. Port availability (non-blocking)"

check_port() {
  local port=$1
  if nc -z localhost "$port" >/dev/null 2>&1; then
    pass "Port $port is open"
  else
    echo "⚠️ Port $port not open yet (may be expected)"
  fi
}

check_port 8000
check_port 5173

echo ""
echo "=============================================="
echo "🎉 ALL VALIDATIONS PASSED"
echo "Your project runs & edits smoothly 🚀"
echo "=============================================="