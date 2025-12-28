#!/bin/bash

# Setup script for Kubernetes Universal Dev Environment
set -e  # Exit immediately if a command exits with a non-zero status

echo "Starting setup for Kubernetes Universal Dev Environment..."

# Create necessary directories
mkdir -p ~/.local/bin
mkdir -p ~/workspace

# Verify that required tools are installed
echo "Verifying required tools..."
command -v kubectl >/dev/null 2>&1 || { echo >&2 "kubectl is required but not installed. Aborting."; exit 1; }
command -v helm >/dev/null 2>&1 || { echo >&2 "helm is required but not installed. Aborting."; exit 1; }
command -v docker >/dev/null 2>&1 || { echo >&2 "docker is required but not installed. Aborting."; exit 1; }

# Setup kubectl aliases
echo "Setting up kubectl aliases..."
echo "alias k='kubectl'" >> ~/.bashrc
echo "alias ksys='kubectl --namespace=kube-system'" >> ~/.bashrc
echo "alias ka='kubectl apply -f'" >> ~/.bashrc
echo "alias kdel='kubectl delete -f'" >> ~/.bashrc
echo "alias kd='kubectl describe'" >> ~/.bashrc
echo "alias kg='kubectl get'" >> ~/.bashrc

# Setup common functions
cat << 'EOF' >> ~/.bashrc

# kubectl functions
kdes() { kubectl describe "$@"; }
kget() { kubectl get "$@"; }
klg() { kubectl logs "$@"; }
kex() { kubectl exec -it "$@" -- /bin/sh; }

# kubens and kubectx functions
kns() { kubens "$@"; }
kcx() { kubectx "$@"; }

# Context and namespace helpers
kctx() {
  if [ $# -eq 0 ]; then
    kubectl config current-context
  else
    kubectl config use-context "$1"
  fi
}

kns-get() {
  kubectl get namespaces
}

EOF

# Install krew (kubectl plugin manager) if not already installed
if ! command -v kubectl-krew >/dev/null 2>&1; then
  echo "Installing krew..."
  (
    set -x; cd "$(mktemp -d)" &&
    OS="$(uname | tr '[:upper:]' '[:lower:]')" &&
    ARCH="$(uname -m | sed -e 's/aarch64/arm64/' -e 's/x86_64/amd64/')" &&
    curl -fsSLO "https://github.com/kubernetes-sigs/krew/releases/latest/download/krew-${OS}_${ARCH}.tar.gz" &&
    tar zxvf "krew-${OS}_${ARCH}.tar.gz" &&
    KREW=./krew-"${OS}_${ARCH}" &&
    "$KREW" install krew
  ) || {
    echo "Failed to install krew"
  }
else
  echo "krew is already installed"
fi

# Install useful krew plugins
if command -v kubectl-krew >/dev/null 2>&1; then
  echo "Installing krew plugins..."
  kubectl krew install tree
  kubectl krew install konfig
  kubectl krew install neat
  kubectl krew install view-secret
  kubectl krew install get-all
  kubectl krew install ingress-nginx
fi

# Setup Python virtual environment
echo "Setting up Python virtual environment..."
python3 -m venv ~/.venv
source ~/.venv/bin/activate
pip install --upgrade pip setuptools wheel

# Add Python venv activation to bashrc
echo "source ~/.venv/bin/activate" >> ~/.bashrc

# Setup default kubectl configuration
if [ ! -f ~/.kube/config ]; then
  echo "No kubectl config found. You may need to configure access to a cluster."
else
  echo "Found kubectl configuration."
fi

# Setup Docker config if it doesn't exist
if [ ! -f ~/.docker/config.json ]; then
  mkdir -p ~/.docker
  echo '{}' > ~/.docker/config.json
fi

# Setup Git configuration
echo "Setting up Git configuration..."
if [ -z "$(git config --global user.name)" ]; then
  echo "Setting up default Git user.name..."
  git config --global user.name "Dev Container User"
fi

if [ -z "$(git config --global user.email)" ]; then
  echo "Setting up default Git user.email..."
  git config --global user.email "devcontainer@example.com"
fi

# Configure Git to cache credentials
git config --global credential.helper cache

# Setup shell prompt with git branch
echo "export PS1='\[\033[01;32m\]\u@\h\[\033[00m\]:\[\033[01;34m\]\w\[\033[00m\]\$(git branch 2>/dev/null | grep '^*' | colrm 1 2)\[\033[00m\]\$ '" >> ~/.bashrc

# Add useful bash functions and aliases
cat << 'GIT_PROXY' >> ~/.bashrc

# Git aliases
alias gs='git status'
alias ga='git add'
alias gc='git commit'
alias gp='git push'
alias gl='git log --oneline'

# Docker aliases
alias dps='docker ps'
alias dpsa='docker ps -a'
alias dimg='docker images'

# Kubernetes aliases
alias kx='kubectl-node-shell'
alias ksys='kubectl -n kube-system'

GIT_PROXY

echo "Setup complete! Please run 'source ~/.bashrc' or start a new terminal session."