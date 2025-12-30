# Development Container Setup

This repository includes a complete development environment configuration using Dev Containers, which works both locally and in GitHub Codespaces.

## Features

- **Python 3.11** backend with FastAPI, Playwright, and other dependencies
- **Node.js 20** frontend environment with npm
- **PostgreSQL 15** database
- **Redis 7** for caching and session storage
- **MinIO** for object storage (S3-compatible)
- **MailHog** for email testing
- Pre-configured VS Code extensions

## Ports Forwarded

- `3000`: Frontend development server
- `5000`: Backend API server
- `5432`: PostgreSQL database
- `6379`: Redis
- `9000`: MinIO API
- `9001`: MinIO Console
- `8025`: MailHog UI
- `1025`: MailHog SMTP

## How to Use

### GitHub Codespaces

1. Open this repository in GitHub Codespaces
2. The devcontainer will automatically build and start
3. The frontend and backend services will start automatically

### Local Dev Container

1. Install Docker Desktop
2. Install the "Dev Containers" extension in VS Code
3. Open this repository in VS Code
4. Press `Ctrl+Shift+P` and select "Dev Containers: Reopen in Container"
5. Wait for the container to build and services to start

## Services

The devcontainer automatically starts:

- Frontend development server (React/Vue app on port 3000)
- Backend API server (FastAPI on port 5000)
- PostgreSQL database
- Redis cache
- MinIO object storage
- MailHog email testing server

## Environment Variables

The environment is preconfigured with appropriate environment variables for connecting to the services. Additional API keys (like GEMINI_API_KEY) should be added to `.env.local`.

## Troubleshooting

If services don't start automatically, run:

```bash
bash .devcontainer/post-start.sh
```

To run health checks on the environment:

```bash
bash .devcontainer/health-check.sh
```