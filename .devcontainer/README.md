# Dev Container Setup for App-Screen

This repository is configured for use with VS Code Dev Containers. Follow the instructions below to set up a consistent development environment.

## Prerequisites

- VS Code installed on your local machine
- Remote - Containers extension for VS Code (`ms-vscode-remote.remote-containers`)
- Docker Desktop or Docker Engine
- WSL 2 (if using Windows)

## Opening the Project in a Dev Container

1. Open VS Code
2. Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
3. Select "Dev Containers: Open Folder in Container..."
4. Select this project folder
5. VS Code will build the container and open the project in the containerized environment

## What's Included in the Dev Container

- Python 3.11
- Node.js 18
- Docker-in-Docker
- GitHub CLI
- Common development utilities
- Required VS Code extensions for the project

## VS Code Extensions

The following extensions will be automatically installed in the container:
- Python extension pack
- TypeScript/JavaScript support
- Docker extension
- ESLint and Prettier
- Live Share

## Project Setup

When the container starts, a setup script will automatically run to:
- Install frontend dependencies using npm
- Set up backend environment if needed
- Create environment files
- Run health checks

## Starting the Development Server

After the container is running and setup is complete:

1. Open a terminal in VS Code
2. Run `npm run dev` to start the development server
3. The server will be available on the default port (usually 5173)

## Troubleshooting

If you encounter issues with the Dev Container setup:

1. Make sure Docker is running
2. Check that you have sufficient disk space
3. Ensure you're using the correct branch of the repository
4. Check the container logs in the VS Code terminal

For WSL-specific issues, run the `wsl_troubleshoot.sh` script in the project root.