# App-Screen Development Environment Makefile

# Commands for managing the development environment

.PHONY: up down dev restart status logs test-backend test-frontend healthcheck

# Start all services in detached mode
up:
	docker compose -f .devcontainer/docker-compose.yml up -d

# Stop all services
down:
	docker compose -f .devcontainer/docker-compose.yml down

# Start development environment and watch for changes
dev: up
	@echo "Services are now running in the background"
	@echo "Connect to the devcontainer via VS Code or Codespaces"

# Restart all services
restart: down up

# Check service status
status:
	docker compose -f .devcontainer/docker-compose.yml ps

# View logs
logs:
	docker compose -f .devcontainer/docker-compose.yml logs -f

# Run backend tests
test-backend:
	docker compose -f .devcontainer/docker-compose.yml exec app python -m pytest

# Run frontend tests
test-frontend:
	docker compose -f .devcontainer/docker-compose.yml exec app npm test

# Check service health
healthcheck:
	docker compose -f .devcontainer/docker-compose.yml ps --health

# Wait for services to be ready
wait-for-services:
	bash .devcontainer/wait-for.sh postgres:5432 || true
	bash .devcontainer/wait-for.sh redis:6379 || true