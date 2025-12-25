FROM mcr.microsoft.com/devcontainers/base:alpine

# Install basic tools
RUN apk add --no-cache \
    curl \
    wget \
    git \
    git-lfs \
    nodejs \
    npm \
    python3 \
    py3-pip \
    build-base \
    python3-dev

# Initialize Git LFS properly
RUN git lfs install

# Fix Git LFS configuration issues
RUN git config --global --unset-all filter.lfs.clean 2>/dev/null || true && \
    git config --global --unset-all filter.lfs.smudge 2>/dev/null || true && \
    git config --global --unset-all filter.lfs.process 2>/dev/null || true && \
    git config --global --unset-all filter.lfs.required 2>/dev/null || true

# Set default shell
SHELL ["/bin/ash", "-o", "pipefail", "-c"]
RUN apk add --no-cache bash

# Install Python dependencies globally
RUN pip install --upgrade pip setuptools wheel

# Install Playwright and required browsers
RUN npm install -g playwright && \
    playwright install chromium

# Install uvicorn for running FastAPI
RUN pip install uvicorn

# Create vscode user if it doesn't exist
ARG USERNAME=vscode
ARG USER_UID=1000
ARG USER_GID=$USER_UID
RUN addgroup -g $USER_GID -S $USERNAME \
    && adduser -u $USER_UID -S $USERNAME -G $USERNAME \
    && apk add --no-cache sudo \
    && echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME

# Switch to vscode user
USER $USERNAME
WORKDIR /workspaces/App-Screen

# EXPOSE ports
EXPOSE 3000 8000

# Use sleep infinity so the container stays running after initialization
# Avoid requiring a non-guaranteed helper script as ENTRYPOINT; keep a simple CMD instead.
CMD ["sleep", "infinity"]