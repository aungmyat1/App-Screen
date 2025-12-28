# Kubernetes Dev Container Usage Guide

This guide provides detailed instructions on how to use the optimized Kubernetes development container.

## Prerequisites

- VS Code with Remote - Containers extension
- Docker installed and running
- Access to a Kubernetes cluster (optional for local development)

## Opening the Dev Container

1. Clone the repository
2. Open the project in VS Code
3. When prompted, click "Reopen in Container" or use Command Palette → "Dev Containers: Reopen in Container"
4. Wait for the container to build and configure

## Working with Kubernetes Clusters

### Connecting to a Remote Cluster

To connect to an existing Kubernetes cluster:

1. Ensure your local `~/.kube/config` is properly configured
2. The dev container automatically mounts this file
3. Test connectivity with `kubectl cluster-info`

### Creating a Local Cluster with kind

Use kind (Kubernetes in Docker) to create a local cluster for testing:

```bash
# Create a cluster
kind create cluster

# Create a cluster with a custom name
kind create cluster --name my-cluster

# Create a cluster with custom configuration
kind create cluster --config ./path/to/cluster-config.yaml

# List clusters
kind get clusters

# Delete a cluster
kind delete cluster --name my-cluster
```

### Using k9s for Cluster Management

k9s provides an interactive terminal UI for Kubernetes:

```bash
# Start k9s
k9s

# Start k9s connected to a specific namespace
k9s -n my-namespace
```

## Development Workflows

### Setting up a New Project

1. Create your project directory:
   ```bash
   mkdir my-k8s-project && cd my-k8s-project
   ```

2. Initialize with your preferred framework

3. Use the Kubernetes tools available in the container

### Using Helm

Helm is pre-installed for Kubernetes package management:

```bash
# Add a chart repository
helm repo add bitnami https://charts.bitnami.com/bitnami

# Update chart repositories
helm repo update

# Install a chart
helm install my-release bitnami/nginx

# Create a new chart
helm create my-chart
```

### Using kubectl Effectively

The container includes several aliases and functions for kubectl:

```bash
# Use the k alias for kubectl
k get pods

# Use aliases for common operations
kg pods                    # kubectl get pods
kd pod my-pod             # kubectl describe pod my-pod
kex my-pod -- bash        # kubectl exec -it my-pod -- bash

# Switch namespaces
kubens my-namespace

# Switch contexts
kubectx my-context
```

### Installing Additional kubectl Plugins

Use krew to install additional kubectl plugins:

```bash
# List available plugins
kubectl krew search

# Install a plugin
kubectl krew install view-secret

# Upgrade all plugins
kubectl krew upgrade

# Remove a plugin
kubectl krew uninstall PLUGIN_NAME
```

## Development Environment Features

### Python Virtual Environment

A Python virtual environment is automatically activated:

```bash
# The environment is already active
python --version

# Install additional packages
pip install my-package

# Deactivate when needed
deactivate

# Reactivate
source ~/.venv/bin/activate
```

### Git Configuration

Git is pre-configured with common aliases:

```bash
# Use Git aliases
gs      # git status
ga      # git add
gc      # git commit
gp      # git push
gl      # git log --oneline
```

### Docker-in-Docker

The container has Docker-in-Docker capabilities:

```bash
# Build an image
docker build -t my-image .

# Run containers
docker run -d -p 8080:80 my-image

# Use with kind for image loading
kind load docker-image my-image:tag
```

## Common Tasks

### Creating a Kubernetes Manifest

1. Create your manifest file:
   ```bash
   touch deployment.yaml
   ```

2. Use kubectl to create basic resources:
   ```bash
   k create deployment my-app --image=nginx --dry-run=client -o yaml > deployment.yaml
   ```

3. Edit and apply:
   ```bash
   k apply -f deployment.yaml
   ```

### Debugging Applications

1. Get pod information:
   ```bash
   kg pods
   ```

2. Check logs:
   ```bash
   k logs pod-name
   ```

3. Execute commands in pods:
   ```bash
   k ex pod-name -- bash
   ```

### Using with GitHub

The GitHub CLI is available for repository management:

```bash
# Authenticate
gh auth login

# Clone a repository
gh repo clone owner/repo

# Create a pull request
gh pr create --title "My PR" --body "Description"
```

## Troubleshooting

### Cluster Connection Issues

If you're having trouble connecting to a cluster:

1. Check kubectl configuration:
   ```bash
   k config current-context
   ```

2. Verify cluster status:
   ```bash
   k cluster-info
   ```

3. Check configuration file:
   ```bash
   cat ~/.kube/config
   ```

### Docker Issues

If Docker commands fail:

1. Check if Docker daemon is running:
   ```bash
   docker info
   ```

2. If using kind clusters, verify they exist:
   ```bash
   kind get clusters
   ```

### Python Environment Issues

If Python packages don't install correctly:

1. Ensure the virtual environment is active:
   ```bash
   which python
   ```

2. Upgrade pip if needed:
   ```bash
   pip install --upgrade pip
   ```