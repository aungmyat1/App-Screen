# Universal Kubernetes Development Environment

This development container provides a complete environment for Kubernetes development, testing, and deployment activities. It's optimized for developers working with Kubernetes applications and infrastructure.

## Features

- **Kubernetes Tools**: kubectl, Helm, kind (Kubernetes in Docker), krew plugin manager
- **Development Tools**: Python 3.11, Node.js 18, npm, Docker-in-Docker
- **Kubernetes Utilities**: k9s, kubectx, kubens, and various krew plugins
- **Git and GitHub**: GitHub CLI, optimized Git configuration
- **Shell Enhancements**: Pre-configured aliases and functions for Kubernetes work

## Optimizations

This dev container has been optimized with:

1. **Faster Builds**: Improved Dockerfile with better layer caching and reduced image size
2. **Essential Tools**: Pre-installed Kubernetes ecosystem tools
3. **Shell Productivity**: Pre-configured aliases and functions for common tasks
4. **Python Environment**: Virtual environment with common packages
5. **Git Integration**: Optimized Git configuration and aliases

## Quick Start

1. Open this folder in a Dev Container supporting editor (VS Code or Codespaces)
2. The container will automatically build with all tools installed
3. Post-create script will run to finalize configuration

## Key Aliases and Functions

### Kubernetes Aliases
- `k` - Short alias for kubectl
- `kg` - kubectl get
- `kd` - kubectl describe
- `ka` - kubectl apply -f
- `kdel` - kubectl delete -f
- `kx` - kubectl-node-shell

### Kubernetes Functions
- `kdes` - kubectl describe with arguments
- `kget` - kubectl get with arguments
- `klg` - kubectl logs with arguments
- `kex` - kubectl exec -it with arguments
- `kns` - kubens (namespace switching)
- `kcx` - kubectx (context switching)

### Git and Docker Aliases
- Git: `gs` (status), `ga` (add), `gc` (commit), `gp` (push), `gl` (log)
- Docker: `dps` (ps), `dpsa` (ps -a), `dimg` (images)

## Pre-installed Tools

- kubectl (latest stable)
- Helm 3
- kind (Kubernetes in Docker)
- k9s (Kubernetes CLI tool)
- krew (kubectl plugin manager)
- kubectx and kubens
- Various krew plugins (tree, konfig, neat, view-secret, get-all, ingress-nginx)

## Usage Tips

1. Use `kind` to create local Kubernetes clusters for testing
2. Use `k9s` for an interactive Kubernetes management interface
3. Use `kubectx` and `kubens` to quickly switch between clusters and namespaces
4. Use `kx` for easy shell access to pods
5. Use the krew plugin manager to install additional kubectl plugins

## Configuration

The dev container is configured to:
- Mount your local .kube and .docker directories for cluster access
- Provide Docker-in-Docker functionality
- Include GitHub CLI for seamless GitHub integration
- Enable Python virtual environment by default
- Include common Python packages for Kubernetes development

## Troubleshooting

If you encounter issues with cluster access:
1. Make sure your local .kube/config is properly configured
2. Verify that the mount is working in the dev container
3. Check that your Kubernetes cluster is accessible from the container

## Prerequisites

- Docker
- VS Code (optional, for dev container support)
- VS Code Remote Containers extension (optional)

## Getting Started

### Using VS Code Dev Containers

1. Clone this repository:
   ```bash
   git clone <repository-url>
   cd k8s-universal-devcontainer
   ```

2. Open the folder in VS Code:
   ```bash
   code .
   ```

3. When prompted, reopen the folder in a container. VS Code will automatically build and start the development container.

### Using Docker Directly

1. Build the container:
   ```bash
   docker build -t k8s-universal-devcontainer .
   ```

2. Run the container:
   ```bash
   docker run -it --rm \
     -v ~/.kube:/home/vscode/.kube \
     -v ~/.docker:/home/vscode/.docker \
     k8s-universal-devcontainer
   ```

## Tools Included

- **kubectl**: Kubernetes command-line tool
- **Helm**: Kubernetes package manager
- **kubectx & kubens**: Utilities for switching between clusters and namespaces
- **k9s**: Kubernetes CLI tool for managing clusters
- **Docker CLI**: Docker command-line tool for container management
- **Python 3.12**: Latest Python version with essential packages
- **Node.js 18**: JavaScript runtime
- **npm**: Node.js package manager
- **Essential Unix Tools**: git, curl, wget, vim, jq, etc.

## Configuration

### VS Code Extensions

The dev container comes with the following extensions pre-configured:

- Kubernetes extension
- Docker extension
- Python extension
- Pylint and Black formatters
- JSON and XML support
- Tailwind CSS IntelliSense

### Shell Aliases

The environment includes useful shell aliases:

- `k` for `kubectl`
- `kdes` for `kubectl describe`
- `kget` for `kubectl get`
- `klg` for `kubectl logs`
- `kex` for `kubectl exec -it`
- `kns` for `kubens` (switch namespace)
- `kcx` for `kubectx` (switch context)
- `kctx` for switching kubectl context

## Kubernetes Manifests

This repository includes sample Kubernetes manifests in the `k8s/` directory:

- `namespace.yaml`: Creates a namespace for development
- `deployment.yaml`: Sample deployment configuration
- `service.yaml`: Service configuration to expose your application

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.