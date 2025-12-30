#!/bin/bash
# Script to clean Docker and VS Code cache for Dev Container performance

echo "Cleaning Docker and VS Code cache for Dev Container..."

echo "Stopping all containers..."
docker-compose down -v

echo "Cleaning Docker system..."
docker system prune -a --volumes

echo "Cleaning VS Code Dev Containers cache..."
rm -rf ~/.vscode-server-containers
rm -rf ~/.vscode-server

echo "Cleaning old VS Code extensions cache..."
rm -rf ~/.vscode/extensions

echo "Docker and VS Code cache cleanup complete."
echo ""
echo "To complete the process:"
echo "1. Restart Docker Desktop"
echo "2. Restart VS Code"
echo "3. Rebuild the Dev Container"
echo ""
echo "Optional: If still having issues, restart WSL with 'wsl --shutdown' command."