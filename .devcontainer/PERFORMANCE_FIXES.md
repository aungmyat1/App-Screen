# Dev Container Performance Fixes

This document outlines the performance improvements made to the Dev Container setup and provides recommendations for optimal performance.

## Changes Made

1. **Resource Limits Added**: Added memory and CPU limits to all services in [docker-compose.yml](./docker-compose.yml) to prevent resource exhaustion.
2. **Unnecessary Features Removed**: Removed the GitHub CLI feature from [devcontainer.json](./devcontainer.json) to reduce startup time.
3. **Root Configuration Removed**: Removed the invalid `.devcontainer.json` from the project root as it was no longer needed.

## Recommended Performance Improvements

### 1. WSL Configuration (for Windows users)

Create or edit your WSL config file:
```bash
code "$HOME/.wslconfig"
```

Add the following configuration:
```ini
[wsl2]
memory=4GB
processors=2
swap=2GB
localhostForwarding=true
```

After making changes, restart WSL:
```bash
wsl --shutdown
```

### 2. Project Location

For better performance on Windows, consider moving your project to the WSL filesystem instead of the mounted Windows drive (`/mnt/d/`):
```bash
# From WSL Ubuntu
mv /mnt/d/ddev/appscreen\ git /home/username/appscreen
# Then open from WSL path in VS Code
```

### 3. Clean Cache When Needed

Use the provided cleanup script when experiencing issues:
```bash
.devcontainer/clean_devcontainer_cache.sh
```

This script will:
- Stop all containers
- Clean Docker system
- Clean VS Code cache
- Prepare for a fresh Dev Container rebuild

### 4. Path Name Issue

The project path contains a space (`appscreen git`), which can cause issues. For best results, consider renaming the directory to remove the space:
```
appscreen-git
```

## Additional Tips

- Monitor Docker resource usage: `docker stats`
- Check system resources: `df -h` and `docker system df`
- If issues persist, try rebuilding from scratch: `docker-compose down -v` followed by a fresh Dev Container rebuild