import sys
import os

# Add the parent directory to the path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', '..'))

try:
    from src.api.routes.screenshots import router
    print("Screenshots router imported successfully!")
    print(f"Router prefix: {router.prefix}")
    print(f"Router tags: {router.tags}")
except Exception as e:
    print(f"Error importing screenshots router: {e}")