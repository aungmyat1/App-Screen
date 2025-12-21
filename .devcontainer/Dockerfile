# [Choice] Python version: 3, 3.11, 3.10, 3.9, 3.8, 3.7, 3.6
ARG VARIANT=3.11
FROM mcr.microsoft.com/devcontainers/python:0-${VARIANT}

# Features section for devcontainer features
ARG INSTALL_ZSH="true"
ARG UPGRADE_PACKAGES="false"
ARG COMMON_LINUX_DISTRO="false"
ARG ENABLE_NONROOT_DOCKER="false"
ARG SOURCE_SOCKET=true
ARG PERSONAL_ACCESS_TOKEN=""
ARG EXTENSIONS_STRING=""
ARG FEATURES={}
ENV DEBIAN_FRONTEND=noninteractive

# Install system dependencies
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends postgresql-client \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
RUN pip install --upgrade pip

# Install Playwright browsers
RUN pip install playwright
RUN playwright install-deps
RUN playwright install chromium firefox webkit

# Install uvicorn for running FastAPI
RUN pip install uvicorn

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

# Setting the ENTRYPOINT to docker-init ensures the piped scripts run during container creation
ENTRYPOINT [ "/usr/local/share/docker-init.sh", "--", "/bin/bash", "-c" ]
# Use sleep infinity so the container stays running after initialization
CMD ["sleep", "infinity"]