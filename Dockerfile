# Use Node.js 18 base image to meet Playwright requirements
FROM node:18-bullseye

# Install Python and other build dependencies required for the application
RUN apt-get update && \
    apt-get install -y python3 python3-pip python3-dev curl build-essential && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY yarn.lock ./

# Install frontend dependencies
RUN npm install

# Install Playwright and required browsers
RUN npx playwright install-deps
RUN npx playwright install chromium

# Copy Python requirements and install Python dependencies
COPY backend/requirements.txt /app/backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy the rest of the application code
COPY . .

# Build frontend assets
RUN npm run build

# Expose port
EXPOSE 8000

# Set environment variables
ENV NODE_ENV=production

# Start the application
CMD ["sh", "-c", "cd backend && python -m uvicorn src.api.main:app --host 0.0.0.0 --port 8000"]