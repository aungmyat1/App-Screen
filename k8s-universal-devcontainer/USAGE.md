# Using the Universal Kubernetes Dev Container in Any Project

This document explains how to use the universal Kubernetes development container in any project.

## Quick Setup

To use this universal development environment in any project, follow these steps:

1. Create a `.devcontainer` folder in your project root:
   ```bash
   mkdir -p .devcontainer
   ```

2. Create a `devcontainer.json` file in the `.devcontainer` folder with the following content:
   ```json
   {
     "name": "Project Using Universal K8s Dev",
     "image": "your-dockerhub-username/universal-dev:latest",
     "workspaceFolder": "/workspace"
   }
   ```

3. Replace `your-dockerhub-username/universal-dev:latest` with the actual Docker Hub image name where you've pushed your universal dev container.

## Detailed Steps

1. In your project repository, create the `.devcontainer` directory:
   ```
   .your-project/
   ├── .devcontainer/
   │   └── devcontainer.json
   ├── src/
   ├── package.json
   └── ...
   ```

2. Add the `devcontainer.json` file with the content shown above.

3. Open your project in VS Code.

4. When prompted, click "Reopen in Container" or use the command palette (Ctrl+Shift+P) and select "Dev Containers: Reopen in Container".

## What You Get

Once the container is running, you'll have access to:

- Kubernetes CLI tools (kubectl)
- Helm package manager
- Node.js and npm
- Python and pip
- Docker CLI
- Git
- And other common development tools

## Benefits

- Consistent development environment across all projects
- No need to install tools locally
- Same setup for all team members
- Easy onboarding for new developers
- Reproducible development environments

## Note

Remember to replace `your-dockerhub-username` in the image name with your actual Docker Hub username where you've published the universal dev container image.