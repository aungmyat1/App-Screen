FROM mcr.microsoft.com/devcontainers/base:alpine-3.22

# Install system dependencies
RUN apk add --no-cache \
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

# Create workspace
WORKDIR /workspaces/App-Screen

# Fix Git LFS configuration issues
RUN git config --global --unset-all filter.lfs.clean 2>/dev/null || true && \
    git config --global --unset-all filter.lfs.smudge 2>/dev/null || true && \
    git config --global --unset-all filter.lfs.process 2>/dev/null || true && \
    git config --global --unset-all filter.lfs.required 2>/dev/null || true

# Set default shell
SHELL ["/bin/ash", "-o", "pipefail", "-c"]
RUN apk add --no-cache curl bash && \
    npm install -g npm

# Install Python dependencies
RUN pip install --upgrade pip setuptools wheel

# Install Playwright
RUN python -m pip install playwright

# Install Playwright dependencies and browsers
RUN npx playwright install-deps && \
    npx playwright install chromium

# Install uvicorn for running FastAPI
RUN python -m pip install uvicorn

# Set working directory
WORKDIR /workspaces/App-Screen

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