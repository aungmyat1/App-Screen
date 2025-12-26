# Dev Container Setup for App-Screen

This repository includes a complete development container configuration that works with both VS Code and GitHub Codespaces.

## 🚀 Quick Start

### Option 1: GitHub Codespaces (Recommended)
1. Click the green "Code" button on GitHub
2. Select "Codespaces" tab
3. Click "Create codespace on main"
4. Wait for the environment to build (2-3 minutes first time)
5. Your dev environment is ready!

### Option 2: VS Code Dev Containers
**Prerequisites:**
- Docker Desktop installed and running
- VS Code with "Dev Containers" extension installed

**Steps:**
1. Clone the repository:
   ```bash
   git clone https://github.com/aungmyat1/App-Screen.git
   cd App-Screen
   ```

2. Open in VS Code:
   ```bash
   code .
   ```

3. When prompted "Reopen in Container", click **Yes**
   - Or press `F1` → "Dev Containers: Reopen in Container"

4. Wait for the container to build (first time: 5-10 minutes)

5. Once ready, the terminal will show a success message!

## 📦 What's Included

### Technologies & Tools
- **Node.js 20**: For frontend development (React, Vite, TypeScript)
- **Python 3.11**: For backend development (Flask/FastAPI)
- **PostgreSQL 15**: Database for storing app data
- **Redis 7**: Caching and session management
- **Docker-in-Docker**: Build and run containers within dev container
- **Chrome**: For Chrome extension development and testing
- **Git & GitHub CLI**: Version control tools

### VS Code Extensions
- ESLint, Prettier: Code formatting and linting
- Python, Pylance, Black: Python development
- Docker: Container management
- Tailwind CSS IntelliSense: CSS framework support
- GitLens: Advanced Git features
- GitHub Copilot: AI pair programming (if licensed)
- Error Lens: Inline error highlighting

### Pre-configured Services
- Frontend dev server: Port 3000/5173
- Backend API: Port 5000/8000
- PostgreSQL: Port 5432
- Redis: Port 6379

## 🛠️ Development Workflow

### Starting Services

**Option A: Using VS Code Tasks**
1. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
2. Type "Tasks: Run Task"
3. Select "Run All Services"

**Option B: Manual Start**

Frontend:
```bash
npm run dev
```

Backend:
```bash
cd backend
source .venv/bin/activate
python app.py
```

### Running Tests

Python tests:
```bash
cd backend
source .venv/bin/activate
pytest
```

Frontend tests:
```bash
npm test
```

### Building Chrome Extension

```bash
cd chrome-extension
npm run build
```

Load extension in Chrome:
1. Open `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `chrome-extension/dist` folder

## 🔧 Configuration

### Environment Variables

The dev container creates `.env.local` automatically. Update it with your credentials:

```env
# Gemini API Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# Database Configuration
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/appscreen

# Redis Configuration
REDIS_URL=redis://localhost:6379

# App Configuration
NODE_ENV=development
PORT=3000
BACKEND_PORT=5000
```

### Database Access

Connect to PostgreSQL:
```bash
psql -h localhost -U postgres -d appscreen
# Password: postgres
```

Connect to Redis:
```bash
redis-cli
```

## 🐛 Debugging

### Python Backend
1. Set breakpoints in your Python code
2. Press `F5` or go to Run and Debug panel
3. Select "Python: Backend Debug"
4. Start debugging!

### Frontend
1. Set breakpoints in TypeScript/JavaScript files
2. Press `F5`
3. Select "Node: Debug Frontend"

### Full Stack Debugging
1. Press `F5`
2. Select "Full Stack: Debug All"
3. Debug both frontend and backend simultaneously!

## 📚 Project Structure

```
App-Screen/
├── .devcontainer/          # Dev container configuration
│   ├── devcontainer.json   # Main configuration
│   ├── docker-compose.yml  # Services setup
│   ├── Dockerfile          # Container image
│   └── post-create.sh      # Automated setup script
├── .vscode/                # VS Code configuration
│   ├── tasks.json          # Predefined tasks
│   ├── launch.json         # Debug configurations
│   └── settings.json       # Editor settings
├── backend/                # Python backend
│   ├── app.py              # Main application
│   ├── requirements.txt    # Python dependencies
│   └── .venv/              # Virtual environment
├── screenshot-saas/        # Frontend application
│   ├── src/                # Source code
│   └── package.json        # Node dependencies
├── chrome-extension/       # Chrome extension
│   ├── manifest.json       # Extension manifest
│   └── src/                # Extension source
├── package.json            # Root dependencies
└── requirements.txt        # Root Python dependencies
```

## 🎯 Common Tasks

| Task | Command |
|------|---------|
| Install all dependencies | `bash .devcontainer/post-create.sh` |
| Start frontend | `npm run dev` |
| Start backend | `cd backend && python app.py` |
| Format Python code | `black . && isort .` |
| Format TypeScript code | `npm run format` |
| Run Python tests | `pytest` |
| Build production | `npm run build` |
| View logs | `docker-compose logs -f` |

## 🔍 Troubleshooting

### Port Already in Use
```bash
# Find process using port
lsof -i :3000
# Kill process
kill -9 <PID>
```

### PostgreSQL Connection Issues
```bash
# Check if PostgreSQL is running
pg_isready -h localhost -p 5432 -U postgres

# Restart PostgreSQL
docker-compose restart db
```

### Python Dependencies Not Found
```bash
cd backend
source .venv/bin/activate
pip install -r requirements.txt
```

### Node Modules Issues
```bash
rm -rf node_modules package-lock.json
npm install
```

### Rebuild Container
1. Press `F1`
2. Type "Dev Containers: Rebuild Container"
3. Wait for rebuild to complete

## 🌟 Features

### ✅ Auto-completion & IntelliSense
- Full TypeScript/JavaScript autocomplete
- Python type hints and suggestions
- Tailwind CSS class suggestions
- Import path autocomplete

### ✅ Code Formatting
- Auto-format on save (Python, TypeScript, JSON)
- Consistent code style across team
- ESLint and Prettier integration

### ✅ Git Integration
- Visual diff viewer
- Blame annotations
- Branch management
- Commit history visualization

### ✅ Database Tools
- Direct PostgreSQL access
- Redis CLI integration
- Database migration support

## 📖 Additional Resources

- [Dev Containers Documentation](https://code.visualstudio.com/docs/devcontainers/containers)
- [GitHub Codespaces Docs](https://docs.github.com/en/codespaces)
- [Docker Documentation](https://docs.docker.com/)
- [VS Code Tasks](https://code.visualstudio.com/docs/editor/tasks)
- [VS Code Debugging](https://code.visualstudio.com/docs/editor/debugging)

## 🤝 Contributing

When contributing:
1. Make sure dev container builds successfully
2. All tests pass: `npm test && cd backend && pytest`
3. Code is formatted: `npm run format` and `black .`
4. Update documentation if needed

## 📝 Notes

- First build takes 5-10 minutes (downloads images, installs dependencies)
- Subsequent starts are much faster (30 seconds)
- All data persists in Docker volumes (postgres-data, redis-data)
- VS Code settings are shared across team via `.vscode/`
- Extensions install automatically for all team members

---

**Happy Coding! 🚀**

If you encounter issues, please open an issue on GitHub or contact the team.