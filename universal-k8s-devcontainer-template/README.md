# 🚀 Universal Kubernetes Dev Container Template

A production-ready GitHub template for building consistent Kubernetes-powered development environments using VS Code Dev Containers and GitHub Codespaces.

## ✨ Features

- Kubernetes (kubectl, helm)
- Docker CLI with Docker-in-Docker support
- Node.js + Python runtimes
- GitHub Codespaces ready
- One-click reusable template
- Local Kubernetes cluster with k3d
- Professional development tooling

## 🧑‍💻 Usage

1. Click **Use this template**
2. Open in Codespaces
3. Start coding immediately

## 📦 Ideal For

- SaaS startups
- Platform engineers
- AI & backend developers
- Kubernetes application development
- Consistent team environments

## 🛠️ Included Tools

- `kubectl` - Kubernetes command-line tool
- `helm` - Kubernetes package manager
- `docker` - Container management
- `nodejs` - JavaScript runtime
- `python3` - Python runtime
- `k3d` - Kubernetes in Docker
- `gh` - GitHub CLI
- VS Code extensions for Kubernetes, Docker, and Git

## 🚀 Quick Start

After opening in Codespaces or VS Code with Dev Containers:

1. The environment will automatically initialize
2. A local k3d Kubernetes cluster will be created
3. All tools will be verified and ready to use

## 🔧 Customization

To customize the development container for your specific project:

1. Modify the [Dockerfile](./.devcontainer/Dockerfile) to add additional tools
2. Update the [devcontainer.json](./.devcontainer/devcontainer.json) to change settings
3. Enhance the [setup.sh](./.devcontainer/scripts/setup.sh) script with project-specific setup

## 📁 Repository Structure

```
universal-k8s-devcontainer-template/
├── .devcontainer/          # Dev container configuration
│   ├── devcontainer.json
│   ├── Dockerfile
│   └── scripts/
│       └── setup.sh
├── k8s/                    # Kubernetes manifests
│   ├── namespace.yaml
│   ├── deployment.yaml
│   └── service.yaml
├── .github/                # GitHub configuration
│   └── workflows/          # GitHub Actions
└── README.md
```

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.