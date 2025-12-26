import sys
import os

# Add playwright to path if needed
playwright_path = os.path.join(os.path.dirname(__file__), '..', '..', 'usr', 'local', 'lib', 'python3.*', 'site-packages')
if playwright_path:
    import glob
    matches = glob.glob(playwright_path)
    if matches:
        sys.path.insert(0, matches[0])

try:
    from playwright.sync_api import sync_playwright
    
    with sync_playwright() as p:
        # Use system chromium
        browser = p.chromium.launch(
            executable_path='/usr/bin/chromium',
            args=['--no-sandbox', '--headless', '--disable-dev-shm-usage']
        )
        page = browser.new_page()
        page.goto('https://example.com')
        print(f"Success! Title: {page.title()}")
        browser.close()
except Exception as e:
    print(f"Error: {e}")
    print("Trying alternative...")
    
    # Fallback to requests + beautifulsoup for simple tasks
    try:
        import requests
        from bs4 import BeautifulSoup
        response = requests.get('https://example.com')
        soup = BeautifulSoup(response.text, 'html.parser')
        print(f"Using requests: Title: {soup.title.string}")
    except:
        print("Please install: pip install requests beautifulsoup4")
