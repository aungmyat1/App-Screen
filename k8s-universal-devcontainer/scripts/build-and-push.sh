#!/bin/bash

# Script to build and push the universal development container image
# Usage: ./scripts/build-and-push.sh <dockerhub-username>

set -e  # Exit immediately if a command exits with a non-zero status

if [ $# -ne 1 ]; then
    echo "Usage: $0 <dockerhub-username>"
    echo "Example: $0 acme-corp"
    exit 1
fi

DOCKERHUB_USERNAME=$1
IMAGE_NAME="${DOCKERHUB_USERNAME}/universal-dev:latest"

echo "Building Docker image: ${IMAGE_NAME}"
docker build -t ${IMAGE_NAME} .

echo "Pushing image to DockerHub: ${IMAGE_NAME}"
docker push ${IMAGE_NAME}

echo "Build and push completed successfully!"
echo "You can now update your k8s/deployment.yaml to use: ${IMAGE_NAME}"