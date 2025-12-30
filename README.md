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