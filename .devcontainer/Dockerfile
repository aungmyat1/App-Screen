# Use Ubuntu 22.04 base image
FROM mcr.microsoft.com/devcontainers/base:ubuntu-22.04

# Set non-interactive frontend for apt
ENV DEBIAN_FRONTEND=noninteractive

# Install system tools, Python and Node.js
RUN apt-get update && apt-get install -y \
    curl \
    git \
    unzip \
    ca-certificates \
    gnupg \
    lsb-release \
    build-essential \
    python3 \
    python3-pip \
    python3-dev \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js LTS
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies for the backend
RUN pip3 install --no-cache-dir \
    aiohttp==3.13.2 \
    alembic==1.17.2 \
    amqp==5.3.1 \
    anyio==4.12.0 \
    beautifulsoup4==4.14.3 \
    billiard==4.2.4 \
    boto3==1.42.14 \
    celery==5.6.0 \
    certifi==2025.11.12 \
    fastapi==0.126.0 \
    gunicorn==23.0.0 \
    httpx==0.28.1 \
    playwright==1.57.0 \
    psycopg2-binary==2.9.11 \
    pydantic==2.12.5 \
    redis==3.5.3 \
    requests==2.32.5 \
    sentry-sdk==2.48.0 \
    sqlalchemy==2.0.45 \
    stripe==14.1.0 \
    uvicorn==0.38.0 \
    python-multipart==0.0.5 \
    slowapi==0.1.5 \
    flower==1.0.0 \
    Pillow==11.2.1 \
    prometheus-client==0.20.0 \
    email-validator==2.2.0 \
    passlib==1.7.4 \
    bcrypt==4.2.0 \
    python-jose[cryptography]==3.3.0

# Install kubectl
RUN curl -fsSL https://dl.k8s.io/release/stable.txt | \
    xargs -I{} curl -LO https://dl.k8s.io/release/{}/bin/linux/amd64/kubectl \
    && chmod +x kubectl \
    && mv kubectl /usr/local/bin/

# Install Helm
RUN curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# Install GitHub CLI
RUN curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg && \
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | tee /etc/apt/sources.list.d/github-cli.list > /dev/null && \
    apt-get update && \
    apt-get -y install gh && \
    rm -rf /var/lib/apt/lists/*

# Install AWS CLI
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && \
    unzip awscliv2.zip && \
    ./aws/install && \
    rm awscliv2.zip && \
    rm -rf ./aws

# Install Oh My Zsh
RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended

# Install Python dependencies for the backend

# Set environment variables
ENV NODE_ENV=development
ENV PYTHONUNBUFFERED=1
ENV GIT_DISCOVERY_ACROSS_FILESYSTEM=1

# Set working directory
WORKDIR /workspace

# Install Python development tools
RUN python3 -m pip install --upgrade pip && \
    python3 -m pip install black flake8 pytest

# The vscode user is already created in the base image
# Ensure the user is in the necessary groups
USER root
RUN usermod -a -G sudo vscode
RUN echo 'vscode ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers.d/50-vscode

# Set default Python version
RUN update-alternatives --install /usr/bin/python python /usr/bin/python3 1

# Switch back to vscode user
USER vscode

# Expose common ports for development
EXPOSE 3000 5000 8000

# Default command
CMD ["sleep", "infinity"]