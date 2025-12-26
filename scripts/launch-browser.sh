#!/bin/bash

# Script to launch the browser for the App-Screen application
# This helps avoid issues with browser launching in containerized environments

echo "Attempting to launch browser for App-Screen application..."

# Check if we're in a container environment and handle accordingly
if [ -n "$DISPLAY" ]; then
    # If we have a display available, try to open the browser
    if command -v chromium &> /dev/null; then
        echo "Launching Chromium browser..."
        # Use no-sandbox in containerized environments to avoid issues
        chromium --no-sandbox --disable-dev-shm-usage --disable-web-security "http://localhost:3000" &
        echo "Browser launched successfully"
    elif command -v google-chrome &> /dev/null; then
        echo "Launching Chrome browser..."
        google-chrome --no-sandbox --disable-dev-shm-usage --disable-web-security "http://localhost:3000" &
        echo "Browser launched successfully"
    else
        echo "No supported browser found to launch"
    fi
else
    echo "No display available. Please open your browser and navigate to http://localhost:3000"
    echo "If you're in VS Code, you can use the 'Ports' tab to open the application in a browser."
fi