FROM mcr.microsoft.com/devcontainers/python:3.11

# Features section for devcontainer features
ARG INSTALL_ZSH="true"
ARG UPGRADE_PACKAGES="false"
ARG COMMON_LINUX_DISTRO="false"
ARG ENABLE_NONROOT_DOCKER="false"
ARG SOURCE_SOCKET=true
ARG PERSONAL_ACCESS_TOKEN=""
ARG EXTENSIONS_STRING=""
ARG FEATURES={}

# Install system dependencies on Debian-based devcontainer image
RUN apt-get update && apt-get install -y --no-install-recommends \
    bash \
    curl \
    wget \
    git \
    postgresql-client \
    nodejs \
    npm \
    ca-certificates \
    gnupg2 \
    dirmngr \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
RUN pip install --upgrade pip setuptools wheel

# Install Playwright dependencies (Debian package names)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libstdc++6 \
    libx11-6 \
    libxcomposite1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxrandr2 \
    libxrender1 \
    xvfb \
    libfreetype6 \
    fontconfig \
    libglib2.0-0 \
    dbus-user-session \
    libgtk-3-0 \
    libgbm1 \
    mesa-utils \
    libnss3 \
    && rm -rf /var/lib/apt/lists/*

# Install Playwright and browsers
RUN python -m pip install --upgrade pip setuptools wheel
RUN python -m pip install playwright
RUN npx playwright install-deps || playwright install-deps || true
RUN npx playwright install chromium || playwright install chromium

# Install uvicorn for running FastAPI
RUN python -m pip install uvicorn

WORKDIR /workspaces/App-Screen-

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