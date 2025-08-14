#!/bin/bash

# Script to set a single GitHub secret interactively
# Usage: ./set-github-secret.sh SECRET_NAME
# Example: ./set-github-secret.sh MAILTRAP_API_TOKEN

set -e

# Check if secret name is provided
if [ $# -eq 0 ]; then
    echo "Usage: $0 SECRET_NAME"
    echo "Example: $0 MAILTRAP_API_TOKEN"
    echo ""
    echo "Common secrets for this project:"
    echo "  - OPENAI_API_KEY"
    echo "  - GOOGLE_CLIENT_ID"
    echo "  - GOOGLE_CLIENT_SECRET"
    echo "  - SQLITE_CLOUD_URL"
    echo "  - SESSION_SECRET_KEY"
    echo "  - MAILTRAP_API_TOKEN"
    echo "  - ADMIN_NOTIFICATION_EMAILS"
    echo "  - CORS_ORIGINS"
    exit 1
fi

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "Error: GitHub CLI (gh) is not installed."
    echo "Install it from: https://cli.github.com/"
    echo ""
    echo "On macOS: brew install gh"
    echo "On Ubuntu/Debian: sudo apt install gh"
    exit 1
fi

# Check if authenticated with GitHub
if ! gh auth status &> /dev/null; then
    echo "Error: Not authenticated with GitHub."
    echo "Please run: gh auth login"
    exit 1
fi

# Get the secret name from command line argument
SECRET_NAME="$1"

# Display current repository
REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null || echo "unknown")
echo "Repository: $REPO"
echo ""

# Prompt for secret value (hidden input)
echo "Enter value for $SECRET_NAME:"
echo "(Input is hidden for security)"
read -s SECRET_VALUE

# Check if value is empty
if [ -z "$SECRET_VALUE" ]; then
    echo ""
    echo "Error: Secret value cannot be empty"
    exit 1
fi

# Confirm before setting
echo ""
echo "Ready to set GitHub secret: $SECRET_NAME"
echo "Repository: $REPO"
echo -n "Continue? (y/N): "
read -r CONFIRM

if [[ "$CONFIRM" =~ ^[Yy]$ ]]; then
    # Set the secret
    echo "$SECRET_VALUE" | gh secret set "$SECRET_NAME"
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Secret '$SECRET_NAME' has been set successfully!"
        
        # Show where to verify
        echo ""
        echo "You can verify the secret at:"
        echo "https://github.com/$REPO/settings/secrets/actions"
    else
        echo ""
        echo "❌ Failed to set secret"
        exit 1
    fi
else
    echo "❌ Cancelled"
    exit 0
fi

