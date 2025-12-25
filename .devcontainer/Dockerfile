FROM mcr.microsoft.com/devcontainers/python:0-3.11

# Install basic tools
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    git \
    git-lfs \
    nodejs \
    npm \
    build-essential \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Initialize Git LFS properly
RUN git lfs install

# Fix Git LFS configuration issues
RUN git config --global --unset-all filter.lfs.clean 2>/dev/null || true && \
    git config --global --unset-all filter.lfs.smudge 2>/dev/null || true && \
    git config --global --unset-all filter.lfs.process 2>/dev/null || true && \
    git config --global --unset-all filter.lfs.required 2>/dev/null || true

# Create vscode user if it doesn't exist (already handled by devcontainer features)
ARG USERNAME=vscode
ARG USER_UID=1000
ARG USER_GID=$USER_UID

# Install Python dependencies in a virtual environment
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install Python packages in the virtual environment
RUN pip install --upgrade pip setuptools wheel

# Install Playwright and required browsers
RUN npm install -g playwright && \
    playwright install chromium

# Install uvicorn for running FastAPI in the virtual environment
RUN pip install uvicorn

# Set the default shell
SHELL ["/bin/bash", "-o", "pipefail", "-c"]

# Set working directory first, then switch user
WORKDIR /workspaces/App-Screen
USER $USERNAME

# EXPOSE ports
EXPOSE 3000 8000 5173

# Use sleep infinity so the container stays running after initialization
# Avoid requiring a non-guaranteed helper script as ENTRYPOINT; keep a simple CMD instead.
CMD ["sleep", "infinity"]