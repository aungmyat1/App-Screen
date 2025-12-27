# Kubernetes Universal Dev Environment

This repository provides a standardized development environment for Kubernetes projects. It includes all the necessary tools and configurations needed to develop, test, and deploy applications to Kubernetes clusters.

## Features

- **Pre-configured Development Tools**: Includes kubectl, Helm, kubectx, kubens, k9s, and other essential Kubernetes tools
- **Docker Integration**: Full Docker support with Docker-in-Docker capabilities
- **VS Code Dev Container Support**: Ready-to-use configuration for VS Code development containers
- **Language Support**: Python, Node.js, and TypeScript with appropriate extensions
- **Kubernetes CLI Tools**: Complete set of command-line tools for Kubernetes development
- **Git Integration**: Pre-configured Git setup with common aliases

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