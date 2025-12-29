# WSL Troubleshooting Guide for App-Screen Development

This guide provides instructions on how to troubleshoot common WSL (Windows Subsystem for Linux) and Dev Container issues when working on the App-Screen project.

## Overview

The `wsl_troubleshoot.sh` script is designed to help diagnose and resolve common issues related to:

- WSL version and configuration
- Dev Container setup and rebuilds
- File permissions in the project directory
- VS Code server installation in the container
- Docker installation and status
- Path conversions using wslpath
- VS Code logs examination

## How to Use the Script

### 1. From Windows Command Prompt/PowerShell

```cmd
# Navigate to your project directory
cd "d:\ddev\appscreen git\App-Screen"

# Run the script from WSL
wsl -d <your-distro-name> -u <your-username> bash -c "cd '$(wslpath 'd:\ddev\appscreen git\App-Screen')' && ./wsl_troubleshoot.sh"
```

### 2. From WSL Terminal

If you're already in a WSL terminal:

```bash
cd "d:/ddev/appscreen git/App-Screen"
./wsl_troubleshoot.sh
```

### 3. From VS Code Terminal (Inside Dev Container)

If you're already in the Dev Container:

```bash
cd /workspaces/appscreen  # or wherever your project is mounted
./wsl_troubleshoot.sh
```

## Troubleshooting Steps Performed

### 1. Update WSL to Version 2

The script checks your current WSL version and provides instructions to update if necessary:

```bash
# Check WSL version
wsl --version

# Set WSL 2 as default
wsl --set-default-version 2

# Convert a specific distribution to WSL 2
wsl --set-version <distro-name> 2
```

### 2. Rebuild Dev Container

To rebuild your Dev Container from VS Code:

1. Open the Command Palette (`Ctrl+Shift+P`)
2. Type "Dev Containers: Rebuild Container"
3. Select the command and confirm

This will rebuild your entire development environment from scratch, which often resolves many issues.

### 3. Check File Permissions

The script verifies that the project directory and its files have appropriate permissions for the development process. If you encounter permission issues:

```bash
# Fix permissions for the project directory
sudo chown -R $(whoami):$(whoami) "d:/ddev/appscreen git/App-Screen"
chmod -R 755 "d:/ddev/appscreen git/App-Screen"
```

### 4. Verify VS Code Server Installation

The script checks if VS Code server is correctly installed in the container. If issues are found, try reconnecting to the Dev Container:

1. Open Command Palette (`Ctrl+Shift+P`)
2. Select "Dev Containers: Reopen in Container"

### 5. Check Docker Installation

The script verifies Docker is installed and running. Make sure:

1. Docker Desktop is installed on Windows
2. WSL integration is enabled for your distribution
3. Docker service is running in WSL

### 6. Test Path Conversions

The script uses `wslpath` to test conversions between Windows and Linux paths, ensuring proper cross-platform functionality.

### 7. Examine VS Code Logs

The script looks for VS Code server logs to identify any deeper error messages that might indicate the root cause of issues.

## Common Issues and Solutions

### Issue: Permission Denied Errors

**Symptoms:** Errors when trying to execute files or write to directories.

**Solution:**
1. Ensure your project is stored on a local NTFS drive, not a network drive
2. Check that WSL has access to the drive where your project is located
3. Run the script to check and fix permissions

### Issue: Docker Not Working in Dev Container

**Symptoms:** Docker commands fail inside the Dev Container.

**Solution:**
1. Make sure Docker Desktop is running on Windows
2. Enable WSL integration for your distribution in Docker Desktop settings
3. Restart both Docker Desktop and your Dev Container

### Issue: Dev Container Won't Start

**Symptoms:** VS Code fails to connect to the Dev Container.

**Solution:**
1. Try rebuilding the container using the VS Code command
2. Check that your `.devcontainer` configuration is valid
3. Look for errors in VS Code server logs

## Additional Resources

- [Official WSL Documentation](https://docs.microsoft.com/en-us/windows/wsl/)
- [VS Code Dev Containers Documentation](https://code.visualstudio.com/docs/remote/containers)
- [Docker Desktop WSL Integration](https://docs.docker.com/desktop/wsl/)

## Support

If you continue to experience issues after running the troubleshooting script and following this guide:

1. Run the script and note the output
2. Check the "Recommendations" section at the end of the script output
3. Examine the VS Code server logs for more detailed error messages
4. If needed, open an issue in the repository with the script output and error details