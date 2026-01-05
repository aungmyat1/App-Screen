FROM mcr.microsoft.com/devcontainers/base:ubuntu

ARG NODE_VERSION=20
ARG PYTHON_VERSION=3.11

RUN apt-get update && apt-get install -y \
    build-essential curl wget ca-certificates gnupg lsb-release software-properties-common \
    && rm -rf /var/lib/apt/lists/*

# Node
RUN curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash - \
    && apt-get install -y nodejs

# Python
RUN add-apt-repository ppa:deadsnakes/ppa -y \
    && apt-get update \
    && apt-get install -y python${PYTHON_VERSION} python${PYTHON_VERSION}-venv python${PYTHON_VERSION}-dev \
    && update-alternatives --install /usr/bin/python python /usr/bin/python${PYTHON_VERSION} 1

# Install Git LFS
RUN curl -s https://packagecloud.io/install/repositories/github/git-lfs/script.deb.sh | bash - \
    && apt-get install -y git-lfs \
    && git lfs install --system

RUN npm install -g npm yarn pnpm \
    && python -m pip install --upgrade pip

WORKDIR /workspaces