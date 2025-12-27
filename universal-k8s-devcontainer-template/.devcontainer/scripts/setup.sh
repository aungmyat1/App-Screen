#!/bin/bash
set -e

echo "🔧 Initializing Universal Dev Environment..."

kubectl version --client --short
helm version --short
node -v
python3 --version
docker --version
gh --version

# Install k3d for Kubernetes-in-Docker functionality
echo "📦 Installing k3d for local Kubernetes clusters..."
curl -s https://raw.githubusercontent.com/k3d-io/k3d/main/install.sh | bash

# Create a default k3d cluster
echo "🐳 Creating default k3d cluster..."
k3d cluster create dev-cluster --wait

echo "✅ Environment ready"