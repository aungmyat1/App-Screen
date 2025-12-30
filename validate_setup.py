"""
Validation script to check if the project structure and dependencies are correctly set up.
"""
import os
import sys
from pathlib import Path


def check_directories():
    """Check if all required directories exist."""
    required_dirs = [
        "src/core/scrapers",
        "src/core",
        "src/api/routes",
        "src/api/middleware",
        "src/api",
        "src/workers",
        "src/models",
        "src/utils",
        "tests",
        "docker",
        "config",
        "docs"
    ]
    
    missing_dirs = []
    for dir_path in required_dirs:
        if not os.path.exists(dir_path):
            missing_dirs.append(dir_path)
    
    if missing_dirs:
        print(f"❌ Missing directories: {missing_dirs}")
        return False
    else:
        print("✅ All required directories exist")
        return True


def check_files():
    """Check if key Python files exist."""
    required_files = [
        "src/core/scrapers/base.py",
        "src/core/scrapers/appstore.py",
        "src/core/scrapers/playstore.py",
        "src/core/cache.py",
        "src/core/queue.py",
        "src/core/storage.py",
        "src/api/auth.py",
        "requirements.txt",
        "pyproject.toml",
        "setup.py"
    ]
    
    missing_files = []
    for file_path in required_files:
        if not os.path.exists(file_path):
            missing_files.append(file_path)
    
    if missing_files:
        print(f"❌ Missing files: {missing_files}")
        return False
    else:
        print("✅ All required files exist")
        return True


def check_init_files():
    """Check if __init__.py files exist in required directories."""
    required_init_files = [
        "src/__init__.py",
        "src/core/__init__.py",
        "src/core/scrapers/__init__.py",
        "src/api/__init__.py",
        "src/api/routes/__init__.py",
        "src/api/middleware/__init__.py",
        "src/workers/__init__.py",
        "src/models/__init__.py",
        "src/utils/__init__.py"
    ]
    
    missing_init_files = []
    for file_path in required_init_files:
        if not os.path.exists(file_path):
            missing_init_files.append(file_path)
    
    if missing_init_files:
        print(f"❌ Missing __init__.py files: {missing_init_files}")
        return False
    else:
        print("✅ All required __init__.py files exist")
        return True


def check_requirements():
    """Check if requirements.txt exists and has content."""
    if not os.path.exists("requirements.txt"):
        print("❌ requirements.txt does not exist")
        return False
    
    with open("requirements.txt", "r") as f:
        content = f.read()
        if len(content.strip()) == 0:
            print("❌ requirements.txt is empty")
            return False
    
    print("✅ requirements.txt exists and has content")
    return True


def print_project_structure():
    """Print the project structure."""
    print("\n📁 Project Structure:")
    print("screenshot-saas/")
    print("├── src/")
    print("│   ├── core/")
    print("│   │   ├── scrapers/")
    print("│   │   │   ├── playstore.py")
    print("│   │   │   ├── appstore.py")
    print("│   │   │   └── base.py")
    print("│   │   ├── cache.py")
    print("│   │   ├── queue.py")
    print("│   │   └── storage.py")
    print("│   ├── api/")
    print("│   │   ├── routes/")
    print("│   │   ├── middleware/")
    print("│   │   └── auth.py")
    print("│   ├── workers/")
    print("│   ├── models/")
    print("│   └── utils/")
    print("├── tests/")
    print("├── docker/")
    print("├── config/")
    print("└── docs/")


def main():
    print("🔍 Validating project structure and setup...\n")
    
    checks = [
        check_directories(),
        check_files(),
        check_init_files(),
        check_requirements()
    ]
    
    if all(checks):
        print("\n✅ All checks passed! The project structure is correctly set up.")
        print_project_structure()
        print("\n📋 Next steps:")
        print("1. Set up Python virtual environment: python -m venv venv")
        print("2. Activate virtual environment: source venv/bin/activate (Linux/Mac) or venv\\Scripts\\activate (Windows)")
        print("3. Install dependencies: pip install -r requirements.txt")
        print("4. Install Playwright browsers: python -m playwright install chromium")
        print("5. Run the application: uvicorn src.main:app --reload")
    else:
        print("\n❌ Some checks failed. Please review the issues above.")
        sys.exit(1)


if __name__ == "__main__":
    main()