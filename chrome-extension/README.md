# AppScreens Chrome Extension

A Chrome extension that extracts screenshots from Google Play and App Store pages and sends them to the AppScreens API for processing and storage.

## Features

- Extract screenshots from Google Play Store and Apple App Store pages
- Send extracted screenshots to AppScreens backend API
- Simple popup interface for easy use
- Background processing for continuous operation

## How It Works

1. Navigate to a Google Play or App Store page
2. Click the extension icon
3. Click "Extract Screenshots" to find and capture screenshots on the page
4. Click "Download Screenshots" to send them to the backend API
5. The screenshots are stored and processed by the AppScreens backend

## Setup

1. Make sure the AppScreens backend is running on `http://localhost:8000`
2. Load the extension in Chrome:
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select this `chrome-extension` folder

## Permissions

The extension requires the following permissions:
- Access to `play.google.com` and `apps.apple.com` to extract screenshots
- Access to `http://localhost:8000` to send data to the API

## Files

- `manifest.json` - Extension configuration
- `popup.html` - UI for the extension popup
- `popup.js` - Popup UI logic
- `content.js` - Script that runs on web pages to extract screenshots
- `background.js` - Background script for continuous operation
- `icons/` - Extension icons

## Development

For more details on developing and debugging the extension in VSCode, see the [CHROME_EXTENSION_SETUP.md](../CHROME_EXTENSION_SETUP.md) file in the project root.

## Security

The extension follows security best practices:
- Minimal required permissions
- Secure communication with the backend API
- Proper handling of user data