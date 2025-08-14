# Makefile for auth-demo Docker operations

# Variables
IMAGE_NAME := auth-demo
IMAGE_TAG := latest
CONTAINER_NAME := auth-demo-container
PORT := 3000
HOST_PORT := 4000

# Colors for output
GREEN := \033[0;32m
YELLOW := \033[0;33m
RED := \033[0;31m
NC := \033[0m # No Color

.PHONY: help build start stop restart logs clean status shell

# Default target - show help
help:
	@echo "$(GREEN)Auth Demo - Docker Management$(NC)"
	@echo ""
	@echo "Available targets:"
	@echo "  $(YELLOW)build$(NC)    - Build the Docker image"
	@echo "  $(YELLOW)start$(NC)    - Start the container"
	@echo "  $(YELLOW)stop$(NC)     - Stop the running container"
	@echo "  $(YELLOW)restart$(NC)  - Restart the container (stop + start)"
	@echo "  $(YELLOW)logs$(NC)     - Show container logs"
	@echo "  $(YELLOW)clean$(NC)    - Remove container and image"
	@echo "  $(YELLOW)status$(NC)   - Show container status"
	@echo "  $(YELLOW)shell$(NC)    - Open shell in running container"
	@echo ""
	@echo "Usage: make [target]"

# Build Docker image
build:
	@echo "$(GREEN)Building Docker image...$(NC)"
	@docker build -t $(IMAGE_NAME):$(IMAGE_TAG) .
	@echo "$(GREEN)✓ Image built successfully: $(IMAGE_NAME):$(IMAGE_TAG)$(NC)"

# Start container
start:
	@echo "$(GREEN)Starting container...$(NC)"
	@docker run -d \
		--name $(CONTAINER_NAME) \
		-p $(HOST_PORT):$(PORT) \
		--restart unless-stopped \
		$(IMAGE_NAME):$(IMAGE_TAG)
	@echo "$(GREEN)✓ Container started successfully$(NC)"
	@echo "$(GREEN)  Access the application at: http://localhost:$(HOST_PORT)$(NC)"

# Stop container
stop:
	@echo "$(YELLOW)Stopping container...$(NC)"
	docker stop -t 0 $(CONTAINER_NAME) || true
	docker rm -f $(CONTAINER_NAME) || true

# Restart container (stop + start)
restart: stop start
	@echo "$(GREEN)✓ Container restarted successfully$(NC)"

# View container logs
logs:
	@if docker ps --format '{{.Names}}' | grep -q '^$(CONTAINER_NAME)$$'; then \
		docker logs -f $(CONTAINER_NAME); \
	else \
		echo "$(RED)Container is not running$(NC)"; \
	fi

# Clean up container and image
clean:
	@echo "$(YELLOW)Cleaning up...$(NC)"
	@if docker ps -a --format '{{.Names}}' | grep -q '^$(CONTAINER_NAME)$$'; then \
		docker rm -f $(CONTAINER_NAME) > /dev/null 2>&1; \
		echo "$(GREEN)✓ Container removed$(NC)"; \
	fi
	@if docker images --format '{{.Repository}}:{{.Tag}}' | grep -q '^$(IMAGE_NAME):$(IMAGE_TAG)$$'; then \
		docker rmi $(IMAGE_NAME):$(IMAGE_TAG); \
		echo "$(GREEN)✓ Image removed$(NC)"; \
	fi
	@echo "$(GREEN)✓ Cleanup complete$(NC)"

# Show container status
status:
	@echo "$(GREEN)Container Status:$(NC)"
	@if docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}' | grep -q '$(CONTAINER_NAME)'; then \
		docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}' | grep '$(CONTAINER_NAME)' || echo "NAME                STATUS              PORTS"; \
	else \
		echo "$(RED)Container is not running$(NC)"; \
		echo ""; \
		echo "$(YELLOW)All containers:$(NC)"; \
		docker ps -a --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}' | grep '$(CONTAINER_NAME)' || echo "Container not found"; \
	fi

# Open shell in running container
shell:
	@if docker ps --format '{{.Names}}' | grep -q '^$(CONTAINER_NAME)$$'; then \
		docker exec -it $(CONTAINER_NAME) /bin/sh; \
	else \
		echo "$(RED)Container is not running$(NC)"; \
	fi

# Development targets (local npm development)
.PHONY: dev dev-install dev-build dev-start dev-stop dev-test dev-clean

# Install dependencies for local development
dev-install:
	@echo "$(GREEN)Installing npm dependencies...$(NC)"
	@npm install
	@echo "$(GREEN)✓ Dependencies installed successfully$(NC)"

# Build the project locally
dev-build:
	@echo "$(GREEN)Building project locally...$(NC)"
	@npm run build
	@echo "$(GREEN)✓ Local build completed successfully$(NC)"

# Start local development server
dev-start:
	@echo "$(GREEN)Starting development server...$(NC)"
	@npm run dev

# Start development server in background
dev:
	@echo "$(GREEN)Starting development server...$(NC)"
	@echo "$(YELLOW)Server running at http://localhost:5173$(NC)"
	@echo "$(YELLOW)Press Ctrl+C to stop$(NC)"
	@npm run dev

# Run tests
dev-test:
	@echo "$(GREEN)Running tests...$(NC)"
	@npm test || echo "$(YELLOW)No test script defined$(NC)"

# Clean local development artifacts
dev-clean:
	@echo "$(YELLOW)Cleaning local development artifacts...$(NC)"
	@rm -rf node_modules dist
	@echo "$(GREEN)✓ Clean complete$(NC)"

# Stop any running dev servers (kills processes on port 5173)
dev-stop:
	@echo "$(YELLOW)Stopping development server...$(NC)"
	@lsof -ti:5173 | xargs kill -9 2>/dev/null || echo "$(GREEN)No dev server running$(NC)"
	@echo "$(GREEN)✓ Development server stopped$(NC)"

# Full development setup
dev-setup: dev-install dev
	@echo "$(GREEN)✓ Development environment ready$(NC)"

# Reinstall dependencies and start fresh
dev-fresh: dev-clean dev-install dev
	@echo "$(GREEN)✓ Fresh development environment started$(NC)"

# Check for outdated packages
dev-outdated:
	@echo "$(GREEN)Checking for outdated packages...$(NC)"
	@npm outdated || true

# Update dependencies
dev-update:
	@echo "$(GREEN)Updating dependencies...$(NC)"
	@npm update
	@echo "$(GREEN)✓ Dependencies updated$(NC)"

# Run linter
dev-lint:
	@echo "$(GREEN)Running linter...$(NC)"
	@npm run lint || echo "$(YELLOW)No lint script defined$(NC)"

# Run preview of production build
dev-preview:
	@echo "$(GREEN)Building and previewing production build...$(NC)"
	@npm run build && npm run preview
