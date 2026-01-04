# Screenshot SaaS Application

A comprehensive SaaS application for extracting screenshots from app stores (Apple App Store and Google Play Store).

## Features

- Extract screenshots from both Apple App Store and Google Play Store
- Asynchronous task processing with Celery
- Redis caching for improved performance
- Multiple storage backends (local and S3)
- FastAPI-based REST API
- Authentication and authorization

## Prerequisites

- Python 3.11+
- Node.js v18+
- Redis server
- Docker (optional, for containerization)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd screenshot-saas
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   playwright install chromium
   ```

4. Install frontend dependencies:
   ```bash
   npm install
   ```

## Local Development Setup

### Using VSCode

This project includes VSCode configurations to help with local development:

1. Open the project in VSCode
2. Install recommended extensions (they will be suggested automatically)
3. Use the provided launch configurations to run/debug the application
4. Use the provided tasks for common operations (Ctrl+Shift+P → "Tasks: Run Task")

### Running the Application

**Option 1: Using scripts**
```bash
# Terminal 1: Start backend
source venv/bin/activate
uvicorn src.api.main:app --reload --port 8000

# Terminal 2: Start frontend
npm run dev
```

**Option 2: Using VSCode tasks**
1. Press Ctrl+Shift+P (or Cmd+Shift+P on Mac)
2. Type "Tasks: Run Task"
3. Select "start backend" and "start frontend" tasks

**Option 3: Using the start_services script**
```bash
./start_services.sh
```

### VSCode Debugging

The project includes launch configurations for debugging:

1. **Python: FastAPI** - Runs the backend API with debugging enabled
2. **TypeScript: React Dev Server** - Runs the frontend development server
3. **Full App Debug** - Runs both backend and frontend in debugging mode

To use these:
1. Go to the Run and Debug view (Ctrl+Shift+D)
2. Select the desired configuration from the dropdown
3. Press F5 to start debugging

## Project Structure

```
screenshot-saas/
├── src/
│   ├── core/
│   │   ├── scrapers/
│   │   │   ├── playstore.py
│   │   │   ├── appstore.py
│   │   │   └── base.py
│   │   ├── cache.py
│   │   ├── queue.py
│   │   └── storage.py
│   ├── api/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── auth.py
│   ├── workers/
│   ├── models/
│   └── utils/
├── tests/
├── docker/
├── config/
└── docs/
```

## Usage

1. Start Redis server
2. Run the application:
   ```bash
   uvicorn src.api.main:app --reload --port 8000
   ```

## Development

Run tests:
```bash
pytest
```

## License

MIT