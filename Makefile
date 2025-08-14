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
	@if docker ps -a --format '{{.Names}}' | grep -q '^$(CONTAINER_NAME)$$'; then \
		echo "$(YELLOW)Container already exists, removing...$(NC)"; \
		docker rm -f $(CONTAINER_NAME) > /dev/null 2>&1; \
	fi
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
	@if docker ps --format '{{.Names}}' | grep -q '^$(CONTAINER_NAME)$$'; then \
		docker stop $(CONTAINER_NAME); \
		echo "$(GREEN)✓ Container stopped$(NC)"; \
	else \
		echo "$(RED)Container is not running$(NC)"; \
	fi

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

# Development targets
.PHONY: dev dev-build dev-start

# Build and start for development
dev: build start logs

# Build without cache (force rebuild)
dev-build:
	@echo "$(GREEN)Building Docker image (no cache)...$(NC)"
	@docker build --no-cache -t $(IMAGE_NAME):$(IMAGE_TAG) .
	@echo "$(GREEN)✓ Image rebuilt successfully$(NC)"

# Start with automatic restart and logs
dev-start: start logs