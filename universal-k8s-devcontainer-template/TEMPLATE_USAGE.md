# Template Usage Guide

This guide explains how to use and customize the Universal Kubernetes Dev Container Template.

## Using the Template

### As a GitHub Template
1. On GitHub, click the "Use this template" button
2. Fill in the repository details
3. Create the new repository

### In an Existing Project
To add this development environment to an existing project:

1. Create the `.devcontainer` directory:
   ```bash
   mkdir -p .devcontainer
   ```

2. Copy the devcontainer files:
   - [devcontainer.json](./.devcontainer/devcontainer.json)
   - [Dockerfile](./.devcontainer/Dockerfile)
   - [.devcontainer/scripts/setup.sh](./.devcontainer/scripts/setup.sh)

3. When you open the project in VS Code or Codespaces, you'll be prompted to "Reopen in Container"

## Customizing the Environment

### Adding Tools to the Dockerfile
To add additional tools to your development environment, modify the [Dockerfile](./.devcontainer/Dockerfile):

```Dockerfile
# Add your tools here
RUN apt-get update && apt-get install -y \
    your-additional-package \
    && rm -rf /var/lib/apt/lists/*
```

### Adding VS Code Extensions
To add more VS Code extensions, update the `customizations.vscode.extensions` array in [devcontainer.json](./.devcontainer/devcontainer.json):

```json
{
  "customizations": {
    "vscode": {
      "extensions": [
        "ms-kubernetes-tools.vscode-kubernetes-tools",
        "ms-azuretools.vscode-docker",
        "esbenp.prettier-vscode",
        "eamodio.gitlens",
        "your-favorite-extension"
      ]
    }
  }
}
```

### Customizing the Setup Script
Modify [.devcontainer/scripts/setup.sh](./.devcontainer/scripts/setup.sh) to:
- Install project-specific dependencies
- Set up project-specific configurations
- Run initial project setup commands

## Kubernetes in Development

The environment includes k3d, which allows you to run a Kubernetes cluster inside Docker. You can:

1. Create additional clusters:
   ```bash
   k3d cluster create my-cluster
   ```

2. Interact with the default cluster:
   ```bash
   kubectl get nodes
   ```

3. Deploy your applications:
   ```bash
   kubectl apply -f your-manifests/
   ```

## Building Container Images in Codespaces

With Docker-in-Docker enabled, you can build and push container images directly from Codespaces:

```bash
docker build -t your-image:tag .
docker push your-image:tag
```

## GitHub Actions Integration

The template includes a GitHub Actions workflow for building and pushing your dev container image. To use it:

1. Add `DOCKER_USERNAME` and `DOCKER_PASSWORD` secrets to your repository settings
2. Update the image name in [.github/workflows/docker-build.yml](./.github/workflows/docker-build.yml)
3. The workflow will run automatically on pushes to the main branch

## Troubleshooting

### Codespaces Permission Issues
If you encounter permission issues, make sure the `remoteUser` is set to `vscode` and `updateRemoteUserUID` is true in [devcontainer.json](./.devcontainer/devcontainer.json).

### Docker-in-Docker Issues
If Docker commands are not working, ensure the container is running with the `--privileged` flag as specified in [devcontainer.json](./.devcontainer/devcontainer.json).

### VS Code Extensions Not Installing
If extensions are not installing, check the network connection and the extension identifiers in [devcontainer.json](./.devcontainer/devcontainer.json).