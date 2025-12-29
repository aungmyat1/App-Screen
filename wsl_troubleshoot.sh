#!/bin/bash
# WSL Troubleshooting Script for App-Screen Development
# This script addresses common WSL/Dev Container issues

set -e  # Exit on any error

echo "==================================="
echo "App-Screen WSL Troubleshooting Script"
echo "==================================="

# Function to print section headers
print_header() {
    echo
    echo ">>> $1"
    echo "-----------------------------------"
}

# Function to run command with error checking
run_command() {
    echo "Running: $1"
    eval "$1"
    if [ $? -ne 0 ]; then
        echo "ERROR: Command '$1' failed!"
        exit 1
    fi
}

# 1. Check WSL version and update if necessary
print_header "1. Checking WSL Version"
if command -v wsl &> /dev/null; then
    echo "Current WSL version info:"
    wsl --version 2>/dev/null || echo "Could not get WSL version"
    
    # Check if WSL 2 is available as the default
    wsl_config_file="$HOME/.wslconfig"
    if [ -f "$wsl_config_file" ]; then
        echo "Found .wslconfig file, checking if WSL 2 is configured as default..."
        if grep -q "version=2" "$wsl_config_file"; then
            echo "WSL default version is set to 2"
        else
            echo "WSL default version might not be 2, checking current distros..."
            wsl -l -v 2>/dev/null || echo "Could not list WSL distros"
        fi
    else
        echo ".wslconfig file not found in home directory"
    fi
else
    echo "WSL is not available or not in PATH"
fi

# 2. Check Docker installation and status
print_header "2. Checking Docker Installation and Status"
if command -v docker &> /dev/null; then
    echo "Docker version:"
    docker --version
    echo "Docker info:"
    docker info 2>/dev/null | head -10
else
    echo "Docker is not installed or not in PATH"
    echo "If running inside WSL, make sure Docker Desktop is installed on Windows and WSL integration is enabled"
fi

if command -v systemctl &> /dev/null; then
    # Check if Docker service is running
    if systemctl is-active --quiet docker; then
        echo "Docker service is running"
    else
        echo "Docker service is not running. Attempting to start..."
        if sudo systemctl start docker 2>/dev/null; then
            echo "Docker service started successfully"
        else
            echo "Failed to start Docker service. You may need to start Docker Desktop on Windows."
        fi
    fi
fi

# 3. Check file permissions for the project directory
print_header "3. Checking File Permissions"
PROJECT_ROOT="$(pwd)"
echo "Current project directory: $PROJECT_ROOT"
ls -la "$PROJECT_ROOT" | head -20

# Check if we're in the App-Screen directory
if [ -f "$PROJECT_ROOT/package.json" ] && [ -f "$PROJECT_ROOT/backend/requirements.txt" ]; then
    echo "Confirmed: We are in the App-Screen project directory"
    
    # Check permissions of important directories
    echo "Checking permissions for important directories:"
    for dir in "backend" "src" ".devcontainer" "scripts"; do
        if [ -d "$PROJECT_ROOT/$dir" ]; then
            perms=$(ls -ld "$PROJECT_ROOT/$dir" | cut -d' ' -f1)
            owner=$(ls -ld "$PROJECT_ROOT/$dir" | awk '{print $3":"$4}')
            echo "  $dir: $perms (owned by $owner)"
        fi
    done
else
    echo "Warning: This doesn't seem to be the App-Screen project directory"
fi

# 4. Check VS Code and Dev Container status
print_header "4. Checking VS Code and Dev Container Status"
if command -v code &> /dev/null; then
    echo "VS Code is installed"
    code --version
else
    echo "VS Code is not installed or not in PATH"
fi

# Check if we're running inside a Dev Container
if [ -f "/usr/local/etc/vscode-server/VERSION" ]; then
    echo "We are running inside a VS Code Dev Container"
    echo "VS Code Server Version:"
    cat /usr/local/etc/vscode-server/VERSION 2>/dev/null || echo "Could not read VS Code Server version"
    
    # Check if required VS Code extensions are installed
    echo "Checking for required extensions..."
    extensions_dir="/root/.vscode-server/extensions"
    if [ -d "$extensions_dir" ]; then
        echo "Found $(ls -1 $extensions_dir | wc -l) extensions installed"
    else
        echo "VS Code extensions directory not found"
    fi
else
    echo "We are not running inside a Dev Container"
fi

# 5. Test path conversions with wslpath
print_header "5. Testing Path Conversions with wslpath"
if command -v wslpath &> /dev/null; then
    # Get Windows path for current directory
    if [ -d "$PROJECT_ROOT" ]; then
        win_path=$(wslpath -w "$PROJECT_ROOT" 2>/dev/null || echo "Could not convert path")
        echo "Linux path: $PROJECT_ROOT"
        echo "Windows path: $win_path"
        
        # Test conversion back to Linux
        if [ "$win_path" != "Could not convert path" ]; then
            linux_path=$(wslpath -u "$win_path" 2>/dev/null || echo "Could not convert back")
            echo "Converted back to Linux: $linux_path"
        fi
    fi
else
    echo "wslpath command not available"
fi

# 6. Check for VS Code logs
print_header "6. Examining VS Code Logs"
vscode_logs_dir="$HOME/.vscode-server/data/logs"
if [ -d "$vscode_logs_dir" ]; then
    echo "Found VS Code server logs directory"
    latest_log_dir=$(ls -td "$vscode_logs_dir"/*/ 2>/dev/null | head -n1)
    if [ -n "$latest_log_dir" ]; then
        echo "Latest log directory: $latest_log_dir"
        echo "Recent log files:"
        ls -la "$latest_log_dir" | head -10
        
        # Look for any error files or recent files with errors
        echo "Checking for recent error logs..."
        recent_error_logs=$(find "$latest_log_dir" -name "*error*" -o -name "*fail*" 2>/dev/null | head -5)
        if [ -n "$recent_error_logs" ]; then
            echo "Found potentially problematic logs:"
            echo "$recent_error_logs"
        else
            echo "No obvious error logs found"
        fi
    fi
else
    echo "VS Code server logs directory not found at: $vscode_logs_dir"
fi

# 7. Additional checks for common Dev Container issues
print_header "7. Additional Dev Container Checks"

# Check if Docker Compose is available
if command -v docker-compose &> /dev/null; then
    echo "Docker Compose is available: $(docker-compose --version)"
else
    echo "Docker Compose not available"
fi

# Check if we can access the .devcontainer configuration
if [ -f ".devcontainer/devcontainer.json" ] || [ -f ".devcontainer.json" ]; then
    echo "Dev Container configuration found"
    if [ -f ".devcontainer/devcontainer.json" ]; then
        echo "Dev Container file: .devcontainer/devcontainer.json"
    elif [ -f ".devcontainer.json" ]; then
        echo "Dev Container file: .devcontainer.json"
    fi
else
    echo "Dev Container configuration not found"
fi

# Check if required ports are available (common issue in Dev Containers)
echo "Checking if common development ports are available:"
for port in 3000 8000 8080 5432 6379; do
    if command -v ss &> /dev/null; then
        if ss -tuln | grep -q ":$port "; then
            echo "Port $port is in use"
        else
            echo "Port $port is available"
        fi
    elif command -v netstat &> /dev/null; then
        if netstat -tuln | grep -q ":$port "; then
            echo "Port $port is in use"
        else
            echo "Port $port is available"
        fi
    else
        echo "Cannot check port $port - netstat/ss not available"
    fi
done

# 8. Provide recommendations
print_header "8. Recommendations"
echo "Based on your environment, here are some recommendations:"

if ! command -v docker &> /dev/null; then
    echo "  - Install Docker Desktop for Windows with WSL 2 integration enabled"
    echo "  - Make sure Docker is running on Windows"
fi

if [ ! -f "/usr/local/etc/vscode-server/VERSION" ]; then
    echo "  - Rebuild your Dev Container: In VS Code, press Ctrl+Shift+P and select 'Dev Containers: Rebuild Container'"
fi

if [ -f "$HOME/.wslconfig" ]; then
    echo "  - Your WSL config is at $HOME/.wslconfig"
    echo "  - Consider adjusting memory/processor settings if you're experiencing performance issues"
else
    echo "  - Consider creating a .wslconfig file in your Windows user directory to optimize WSL settings"
fi

echo
echo "==================================="
echo "Troubleshooting Complete"
echo "==================================="
echo
echo "If you're still experiencing issues:"
echo "1. Make sure WSL 2 is set as default: wsl --set-default-version 2"
echo "2. Restart WSL: wsl --shutdown (from Windows PowerShell/CMD)"
echo "3. Rebuild your Dev Container from VS Code"
echo "4. Check Windows Defender/Antivirus exclusions for your project directory"
echo "5. Ensure your project directory is on an NTFS drive (not a network drive)"