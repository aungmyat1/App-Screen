# [Choice] Python version: 3.12, 3.11, 3.10, 3.9, 3.8
FROM mcr.microsoft.com/devcontainers/python:1-3.11-bookworm

# Install Node.js
ARG NODE_VERSION="18"
RUN curl -fsSL https://deb.nodesource.com/setup_$NODE_VERSION.x | bash - && \
    apt-get install -y nodejs \
    && npm install -g npm \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY backend/requirements.txt /tmp/requirements.txt
RUN pip install -r /tmp/requirements.txt && rm /tmp/requirements.txt

# [Optional] Uncomment this section to install additional OS packages
# RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
#     && apt-get install -y --no-install-recommends <your-package-list-here>

# [Optional] Uncomment this line to install global node packages
# RUN su vscode -c "source /usr/local/share/nvm/nvm.sh && npm install -g <your-package-here>" 2>&1