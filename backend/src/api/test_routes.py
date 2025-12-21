import sys
import os

# Add the parent directory to the path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..'))

try:
    from src.api.main import app
    print("Main API app imported successfully!")
    print(f"Routes registered: {[route.path for route in app.routes]}")
except Exception as e:
    print(f"Error importing main API app: {e}")
    import traceback
    traceback.print_exc()