#!/bin/bash

# Activate virtual environment
source venv/bin/activate

# Run the FastAPI application
uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload