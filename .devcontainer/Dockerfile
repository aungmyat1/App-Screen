FROM mcr.microsoft.com/devcontainers/python:1-3.11-bookworm

# Install system dependencies
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
    build-essential \
    curl \
    git \
    wget \
    libpq-dev \
    python3-dev \
    postgresql-client \
    sqlite3 \
    ca-certificates \
    gnupg2 \
    dirmngr \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
RUN pip install --upgrade pip setuptools wheel

# Install Node.js and npm (using the feature, but ensuring compatibility)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g npm

# Install Python dependencies
RUN pip install --upgrade pip setuptools wheel

# Install Playwright
RUN python -m pip install playwright

# Install Playwright dependencies and browsers
RUN npx playwright install-deps && \
    npx playwright install chromium

# Install uvicorn for running FastAPI
RUN python -m pip install uvicorn

# Create workspace directory
RUN mkdir -p /workspaces/App-Screen-

# Set working directory
WORKDIR /workspaces/App-Screen-

# Default shell
SHELL ["/bin/bash", "-o", "pipefail", "-c"]

# Copy requirements files
COPY backend/requirements.txt ./backend/requirements.txt

# Install Python dependencies
RUN cd backend && pip install -r requirements.txt

# Install Node dependencies
# package-lock.json may not exist in the repository root; copy package.json only
COPY package.json ./
RUN npm install --legacy-peer-deps || npm install

EXPOSE 3000 8000

# Use sleep infinity so the container stays running after initialization
# Avoid requiring a non-guaranteed helper script as ENTRYPOINT; keep a simple CMD instead.
CMD ["sleep", "infinity"]