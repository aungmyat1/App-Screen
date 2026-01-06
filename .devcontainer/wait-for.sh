#!/bin/bash

# Wait for services script for App-Screen development environment
# Can wait for various services to be ready before proceeding

set -Eeuo pipefail

show_help() {
    cat <<EOF
Usage: $0 [OPTIONS] HOST:PORT

OPTIONS:
    -t, --timeout SECONDS   Timeout in seconds (default: 30)
    -s, --service NAME     Service name for display (optional)
    -h, --help            Show this help message

EXAMPLES:
    $0 localhost:5432                           # Wait for PostgreSQL
    $0 -t 60 redis:6379                        # Wait for Redis with 60s timeout
    $0 -s "PostgreSQL" -t 45 localhost:5432    # Named service with timeout
EOF
}

TIMEOUT=30
SERVICE_NAME=""

while [[ $# -gt 0 ]]; do
    case $1 in
        -t|--timeout)
            TIMEOUT="$2"
            shift 2
            ;;
        -s|--service)
            SERVICE_NAME="$2"
            shift 2
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            HOST_PORT="$1"
            shift
            ;;
    esac
done

if [ -z "${HOST_PORT:-}" ]; then
    echo "Error: HOST:PORT is required"
    show_help
    exit 1
fi

if [ -z "$SERVICE_NAME" ]; then
    SERVICE_NAME="$HOST_PORT"
fi

echo "⏳ Waiting for $SERVICE_NAME to be ready at $HOST_PORT (timeout: $TIMEOUT seconds)..."

# Split host and port
HOST=$(echo "$HOST_PORT" | cut -d: -f1)
PORT=$(echo "$HOST_PORT" | cut -d: -f2)

# Check if port is an integer
if ! [[ "$PORT" =~ ^[0-9]+$ ]]; then
    echo "Error: Invalid port number: $PORT"
    exit 1
fi

# Try to connect to the service
start_time=$(date +%s)
end_time=$((start_time + TIMEOUT))

while [ $(date +%s) -lt $end_time ]; do
    if command -v nc &> /dev/null; then
        # Use netcat to test the connection
        if nc -z "$HOST" "$PORT"; then
            echo "✅ $SERVICE_NAME is ready at $HOST_PORT"
            exit 0
        fi
    elif command -v timeout &> /dev/null && command -v bash &> /dev/null; then
        # Fallback: try to connect to the port with a timeout
        if exec 3<>/dev/tcp/"$HOST"/"$PORT" 2>/dev/null; then
            exec 3<&-
            exec 3>&-
            echo "✅ $SERVICE_NAME is ready at $HOST_PORT"
            exit 0
        fi
    fi
    
    sleep 1
done

echo "❌ Timeout waiting for $SERVICE_NAME at $HOST_PORT"
echo "ℹ️ If running in Codespaces, the service may still be initializing."
exit 1