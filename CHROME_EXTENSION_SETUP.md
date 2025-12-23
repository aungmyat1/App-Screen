# Chrome Extension Development with VSCode

This guide explains how to set up Chrome Extension development in VSCode for the AppScreens project.

## Prerequisites

- Visual Studio Code installed
- Chrome browser installed
- The AppScreens project running locally (backend on port 8000)

## Setting up VSCode for Chrome Extension Development

### 1. Install Recommended Extensions

Install the following VSCode extensions for Chrome Extension development:

- Chrome Extension (V3) Generator
- Debugger for Chrome
- Chrome Extension Manager
- JSON Tools (for formatting manifest.json)

### 2. Enable Developer Mode in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" using the toggle in the top-right corner

### 3. Load the Extension in Chrome

1. In VSCode, navigate to the `/chrome-extension` folder in this project
2. In Chrome, click "Load unpacked" button
3. Select the `/workspaces/App-Screen-/chrome-extension` folder

### 4. Debugging the Extension

1. Install the "Debugger for Chrome" extension in VSCode
2. Add the following configuration to your `.vscode/launch.json`:

```json
{
  "configurations": [
    {
      "name": "Chrome Extension",
      "type": "chrome",
      "request": "launch",
      "url": "https://www.google.com",
      "runtimeArgs": [
        "--load-extension=/workspaces/App-Screen-/chrome-extension",
        "--user-data-dir=/tmp/chrome_dev_session"
      ],
      "webRoot": "${workspaceFolder}/chrome-extension",
      "sourceMapPathOverrides": {
        "webpack:///./src/*": "${webRoot}/src/*"
      }
    }
  ]
}
```

3. Set breakpoints in your extension files
4. Press F5 to start debugging

## Extension Structure

```
chrome-extension/
├── manifest.json          # Extension configuration
├── popup.html             # UI for the extension popup
├── popup.js               # Popup UI logic
├── content.js             # Script that runs on web pages
├── background.js          # Background script
└── icons/                 # Extension icons
```

## Developing the Extension

1. The extension works with both Google Play Store and App Store pages
2. When on a supported page, the extension will extract screenshots
3. The extracted screenshots are sent to the backend API at `http://localhost:8000/api/v1/screenshots`
4. Make sure the backend is running before using the extension

## API Integration

The extension sends extracted screenshots to the backend API with the following structure:

```javascript
{
  appUrl: "https://play.google.com/store/apps/...",
  screenshots: [
    {
      url: "https://...",
      platform: "google_play" or "app_store",
      originalSize: "1080x1920"
    }
  ]
}
```

## Testing the Extension

1. Make sure the backend is running: `cd backend && python -m uvicorn src.api.main:app --reload`
2. Load the extension in Chrome as described above
3. Navigate to a Google Play or App Store page
4. Click the extension icon and use the "Extract Screenshots" button
5. Check the browser console for any errors (Ctrl+Shift+J in Chrome)

## VSCode Tips for Extension Development

1. **Use the Console**: Open Chrome's developer tools (F12) to see console output from your extension
2. **Reload Quickly**: Use Ctrl+R to reload the extension after making changes
3. **Inspect Popup**: Right-click on the popup and select "Inspect" to debug popup elements
4. **Check Extension Status**: Visit `chrome://extensions/` to see if your extension is loaded and enabled

## Troubleshooting

### Extension not loading:
- Make sure "Developer mode" is enabled in `chrome://extensions/`
- Verify the manifest.json is valid
- Check the Chrome extensions page for any error messages

### Cannot connect to backend:
- Ensure the backend server is running on `http://localhost:8000`
- Check CORS settings in the backend
- Verify the API endpoint is correct

### Screenshots not extracted:
- Check if you're on a supported page (Google Play or App Store)
- Open the console to see if there are JavaScript errors
- Verify that the content script has access to the page elements

## Security Considerations

- The extension requires permissions to access Google Play and App Store pages
- API calls to the backend should be authenticated if required
- Only send necessary data to the backend