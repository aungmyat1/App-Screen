# Use the official Python 3.12 base image with Node.js support
FROM mcr.microsoft.com/devcontainers/python:1-3.12-bullseye

# Install system dependencies in a single layer to optimize Docker cache
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
    git \
    curl \
    wget \
    ca-certificates \
    gnupg \
    lsb-release \
    build-essential \
    libssl-dev \
    libffi-dev \
    python3-dev \
    postgresql-client \
    chromium-browser \
    chromium-chromedriver \
    zsh \
    fonts-powerline \
    openssh-client \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install git-lfs and initialize it
RUN apt-get update && apt-get install -y git-lfs \
    && git lfs install

# Install Node.js 20
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Docker CLI
RUN curl -fsSL https://get.docker.com | sh - \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Docker Compose v2 plugin
RUN DOCKER_CONFIG=/home/vscode/.docker/cli-plugins \
    mkdir -p ${DOCKER_CONFIG} && \
    curl -fsSL "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o ${DOCKER_CONFIG}/docker-compose && \
    chmod +x ${DOCKER_CONFIG}/docker-compose

# Install GitHub CLI
RUN curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg && \
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | tee /etc/apt/sources.list.d/github-cli.list > /dev/null && \
    apt-get update && \
    apt-get -y install gh && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install AWS CLI
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && \
    unzip awscliv2.zip && \
    ./aws/install && \
    rm awscliv2.zip && \
    rm -rf ./aws

# Install Oh My Zsh
RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended \
    && chsh -s $(which zsh)

# Set environment variables
ENV NODE_ENV=development
ENV PYTHONUNBUFFERED=1
ENV GIT_DISCOVERY_ACROSS_FILESYSTEM=1

# Set working directory
WORKDIR /workspace

# Setup user
USER vscode

# Initialize Git LFS
RUN git lfs install

# Install Python development tools using Python 3.12
RUN pip3.12 install --upgrade pip && \
    pip3.12 install black flake8 pytest

# Create the workspace directory
RUN mkdir -p /workspace

# Set the working directory
WORKDIR /workspace

# The vscode user is already created in the base image
# Ensure the user is in the necessary groups
USER root
RUN usermod -a -G sudo vscode
RUN echo 'vscode ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers.d/50-vscode

# Set default Python to 3.12 for all users
RUN update-alternatives --install /usr/bin/python python /usr/bin/python3.12 1

# Switch to the non-root user
USER vscode

# Expose common ports for development
EXPOSE 3000 5000 8000

# Default command
CMD ["sleep", "infinity"]