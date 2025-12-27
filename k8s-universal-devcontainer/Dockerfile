# Universal Kubernetes Development Environment
# A lightweight container with essential Kubernetes development tools
FROM mcr.microsoft.com/devcontainers/base:ubuntu

# Install core tools and dependencies
RUN apt-get update && apt-get install -y \
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

# Install kubectl
RUN curl -LO "https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl" \
    && chmod +x kubectl \
    && mv kubectl /usr/local/bin/

# Install Helm
RUN curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# Upgrade pip and install Python packages
RUN pip3 install --upgrade pip \
    && pip3 install \
        kubernetes \
        kubernetes-asyncio \
        pyyaml \
        requests

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
RUN npm install -g \
    @angular/cli \
    typescript \
    ts-node \
    nodemon \
    concurrently \
    && npm cache clean --force

# Set up environment
ENV PYTHONPATH=/workspace:$PYTHONPATH
WORKDIR /workspace