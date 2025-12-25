# Use Node.js 18 base image to meet Playwright requirements
FROM python:3.11-slim

# Install Node.js 18 (required for Playwright)
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# Install other required system dependencies
RUN apt-get update && \
    apt-get install -y build-essential curl && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy Python requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Install Playwright and required browsers
RUN playwright install-deps
RUN playwright install chromium

# Copy the rest of the application code
COPY . .

# Expose port
EXPOSE 8000

# Set environment variables
ENV NODE_ENV=production

# Run the application
CMD ["sh", "-c", "python -m uvicorn src.api.main:app --host 0.0.0.0 --port 8000"]