# Universal Kubernetes Development Environment
# A lightweight container with essential Kubernetes development tools
FROM mcr.microsoft.com/devcontainers/base:ubuntu

# Avoid prompts from apt
ENV DEBIAN_FRONTEND=noninteractive

# Install core tools and dependencies in a single layer to reduce image size
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    git \
    unzip \
    wget \
    jq \
    vim \
    bash-completion \
    ca-certificates \
    gnupg \
    lsb-release \
    build-essential \
    python3 \
    python3-pip \
    nodejs \
    npm \
    docker.io \
    && rm -rf /var/lib/apt/lists/*

# Install kubectl with the latest stable version
RUN curl -sLO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl" \
    && chmod +x kubectl \
    && mv kubectl /usr/local/bin/ \
    && kubectl version --client

# Install Helm
RUN curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# Install kind (Kubernetes in Docker)
RUN curl -Lo ./kind https://kind.sigs.k8s.io/dl/latest/kind-linux-amd64 \
    && chmod +x kind \
    && mv kind /usr/local/bin/

# Install kubectx and kubens for namespace/context switching
RUN git clone https://github.com/ahmetb/kubectx /opt/kubectx \
    && ln -s /opt/kubectx/kubectx /usr/local/bin/kubectx \
    && ln -s /opt/kubectx/kubens /usr/local/bin/kubens

# Upgrade pip and install Python packages
RUN pip3 install --no-cache-dir --upgrade pip \
    && pip3 install --no-cache-dir \
        kubernetes \
        kubernetes-asyncio \
        pyyaml \
        requests \
        yq \
        kustomize

# Set up bash completion
RUN kubectl completion bash > /etc/bash_completion.d/kubectl \
    && echo 'alias k=kubectl' >> /etc/bash_completion.d/kubectl \
    && echo 'complete -F __start_kubectl k' >> /etc/bash_completion.d/kubectl

# Install k9s for Kubernetes cluster management
RUN wget -qO - https://github.com/derailed/k9s/releases/latest/download/k9s_Linux_amd64.tar.gz | \
    tar -xzf - -C /tmp && \
    mv /tmp/k9s /usr/local/bin && \
    chmod +x /usr/local/bin/k9s

# Install additional tools
RUN npm install -g --no-package-lock \
    @angular/cli \
    typescript \
    ts-node \
    nodemon \
    concurrently \
    kubectl-node-shell \
    && npm cache clean --force

# Create workspace directory
RUN mkdir -p /workspace

# Set environment variables
ENV PYTHONPATH=/workspace:$PYTHONPATH
WORKDIR /workspace